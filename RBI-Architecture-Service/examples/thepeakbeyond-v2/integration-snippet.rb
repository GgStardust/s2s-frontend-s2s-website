# RBI Integration Snippet for ThePeakBeyond V2
# 
# Minimal code example showing RBI integration patterns for Rails/GraphQL architecture.
# This is a simplified version - see IMPLEMENTATION_GUIDE.md for complete examples.

require 'net/http'
require 'json'
require 'uri'

# RBI Service Client
class RbiService
  RBI_API_URL = ENV['RBI_API_URL'] || 'http://localhost:3001'
  RBI_API_KEY = ENV['RBI_API_KEY']

  # Validate content (for pre-validation, GPT output validation, etc.)
  def self.validate_content(content:, category_associations: [])
    call_rbi('/field/validate', {
      content: content,
      categoryAssociations: category_associations
    })
  end

  # Quick quality scoring
  def self.score_content(content:)
    call_rbi('/field/score', { content: content })
  end

  # Similarity search and recommendations
  def self.find_neighbors(query:, candidates:, top_n: 10)
    call_rbi('/field/neighbors', {
      query: { text: query },
      candidates: candidates.map { |c| { id: c[:id].to_s, text: c[:text] } },
      topN: top_n
    })
  end

  # Comprehensive content analysis
  def self.analyze_content(content:, title: nil)
    call_rbi('/field/analyze', {
      content: content,
      title: title
    })
  end

  private

  def self.call_rbi(endpoint, body)
    uri = URI("#{RBI_API_URL}#{endpoint}")
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.path)
    request['Content-Type'] = 'application/json'
    request['X-API-Key'] = RBI_API_KEY if RBI_API_KEY
    request.body = body.to_json

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  rescue => e
    Rails.logger.error("RBI API error: #{e.message}")
    raise e
  end
end

# ============================================
# Usage Examples
# ============================================

# 1. Request Pre-Validation (Server Load Reduction)
class RequestProcessor
  def self.process_api_request(request_data)
    # Pre-validate before expensive operations
    rbi_validation = RbiService.validate_content(
      content: build_request_content(request_data),
      category_associations: extract_categories(request_data)
    )
    
    # Skip expensive operations if incoherent
    unless rbi_validation[:verified] && 
           rbi_validation[:sovereignLogic][:coherence] >= 0.7
      return {
        error: 'Request validation failed',
        coherence: rbi_validation[:sovereignLogic][:coherence]
      }
    end
    
    # Only process validated requests
    expensive_operation(request_data)
  end
end

# 2. GPT Output Validation
class GptService
  def self.generate_response(query:, context:)
    # Call GPT API
    gpt_response = call_openai_api(query: query, context: context)
    
    # Validate GPT output
    output_validation = RbiService.validate_content(
      content: gpt_response[:content]
    )
    
    unless output_validation[:verified] && 
           output_validation[:sovereignLogic][:coherence] >= 0.7
      return fallback_response("Incoherent GPT response")
    end
    
    gpt_response
  end
end

# 3. Data Enrichment Validation
class DataEnrichmentService
  def self.enrich_product(product)
    # Enrich with terpenes, effects, COAs
    enriched_data = fetch_enrichment_data(product)
    
    # Validate enriched data coherence
    validation = RbiService.validate_content(
      content: build_enrichment_string(enriched_data),
      category_associations: product.category_ids
    )
    
    unless validation[:verified]
      Rails.logger.warn("Low coherence in enriched data: #{validation[:sovereignLogic][:coherence]}")
    end
    
    enriched_data
  end
end

# 4. Health Check Integration
class HealthController < ApplicationController
  def show
    rbi_health = check_rbi_service
    
    {
      status: 'healthy',
      services: {
        database: check_database,
        rbi_service: rbi_health
      }
    }
  end

  private

  def check_rbi_service
    start_time = Time.now
    result = RbiService.validate_content(content: 'health check')
    duration = Time.now - start_time
    
    {
      status: result[:verified] ? 'healthy' : 'degraded',
      response_time_ms: (duration * 1000).round(2),
      coherence: result[:sovereignLogic][:coherence]
    }
  rescue => e
    { status: 'unhealthy', error: e.message }
  end
end

# 5. GraphQL Resolver - Semantic Search
module Resolvers
  class ProductsResolver < BaseResolver
    def resolve(query: nil, limit: 10)
      if query.present?
        # RBI semantic search
        products = Product.all
        candidates = products.map do |p|
          { id: p.id, text: "#{p.name} #{p.description}" }
        end
        
        rbi_results = RbiService.find_neighbors(
          query: query,
          candidates: candidates,
          top_n: limit
        )
        
        product_ids = rbi_results[:neighbors].map { |n| n[:id].to_i }
        Product.where(id: product_ids).order(
          Arel.sql("array_position(ARRAY[#{product_ids.join(',')}], id)")
        )
      else
        Product.limit(limit)
      end
    end
  end
end

# 6. CI/CD Quality Gate
# scripts/validate_documentation.rb
class DocumentationValidator
  def self.validate_all
    doc_files = Dir.glob('docs/**/*.md')
    failures = []
    
    doc_files.each do |file|
      content = File.read(file)
      validation = RbiService.validate_content(content: content)
      
      unless validation[:verified] && 
             validation[:sovereignLogic][:coherence] >= 0.7
        failures << { file: file, coherence: validation[:sovereignLogic][:coherence] }
      end
    end
    
    if failures.any?
      puts "❌ Documentation validation failed:"
      failures.each { |f| puts "  #{f[:file]}: coherence #{f[:coherence]}" }
      exit 1
    else
      puts "✅ All documentation validated"
    end
  end
end

# 7. Prometheus Metrics Export
require 'prometheus/client'

PROMETHEUS = Prometheus::Client.registry

RBI_COHERENCE_SCORE = PROMETHEUS.gauge(
  :rbi_coherence_score,
  'RBI coherence score for content (0.0-1.0)',
  labels: [:content_type, :store_id]
)

RBI_VALIDATION_RATE = PROMETHEUS.counter(
  :rbi_validations_total,
  'Total number of RBI validations performed',
  labels: [:validation_type, :status]
)

# Update RbiService to export metrics
class RbiService
  def self.validate_content(content:, category_associations: [])
    start_time = Time.now
    
    result = call_rbi('/field/validate', {
      content: content,
      categoryAssociations: category_associations
    })
    
    # Export metrics
    RBI_VALIDATION_RATE.increment(
      labels: {
        validation_type: 'content',
        status: result[:verified] ? 'verified' : 'failed'
      }
    )
    
    RBI_COHERENCE_SCORE.set(
      result[:sovereignLogic][:coherence],
      labels: { content_type: 'product', store_id: '1' }
    )
    
    result
  end
end

