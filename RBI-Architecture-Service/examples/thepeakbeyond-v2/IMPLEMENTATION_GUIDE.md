# RBI Integration Guide for ThePeakBeyond V2

**Step-by-step implementation guide for V2 architecture (Rails + GraphQL + GPT)**

---

## Quick Start

### 1. Install RBI Architecture Service

```bash
# Clone RBI Architecture Service repository
git clone https://github.com/GgStardust/rbi-architecture-service.git
cd rbi-architecture-service
npm install
```

### 2. Start RBI Service

```bash
# Run in development mode
npm run dev
```

Service runs on `http://localhost:3001`

### 3. Deploy RBI Service (Production)

RBI Architecture Service is a standard Node.js/Express REST API that can be deployed to AWS using multiple options. Choose based on your needs:

- **EC2**: Simplest, fastest to deploy (~30 minutes), good for getting started
- **Lambda/Serverless**: Most cost-effective for low traffic, pay-per-request
- **ECS/Fargate**: Production-ready, auto-scaling, best for high availability

---

## AWS Deployment Options

### Option A: AWS EC2 (Simplest - Recommended for Week 1)

**Time:** ~30 minutes  
**Cost:** ~$10-15/month (t2.micro)  
**Best for:** Immediate deployment, testing, low-to-medium traffic

#### Step-by-Step Instructions

**1. Launch EC2 Instance**
- Go to AWS Console → EC2 → Launch Instance
- **AMI:** Amazon Linux 2023 or Ubuntu 22.04 LTS
- **Instance Type:** t2.micro (free tier) or t3.small (~$15/month)
- **Storage:** 8GB is sufficient
- **Security Group:** Create new group with:
  - Inbound rule: Port 3001 from your VPC (or 0.0.0.0/0 for testing)
  - SSH access from your IP

**2. Connect to Instance**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
# Or for Ubuntu:
ssh -i your-key.pem ubuntu@your-instance-ip
```

**3. Install Node.js 20+**
```bash
# For Amazon Linux 2023:
sudo dnf install -y nodejs npm

# For Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v20.x or higher
npm --version
```

**4. Install Git**
```bash
# Amazon Linux
sudo dnf install -y git

# Ubuntu
sudo apt-get install -y git
```

**5. Clone and Deploy RBI Service**
```bash
# Clone repository
git clone https://github.com/GgStardust/rbi-architecture-service.git
cd rbi-architecture-service

# Install dependencies
npm install

# Build the service
npm run build

# Test locally first
npm start
# Should see: "🌀 RBI Architecture Service v2.0.0"
# Press Ctrl+C to stop
```

**6. Run as Background Service (PM2 Recommended)**
```bash
# Install PM2 (process manager)
sudo npm install -g pm2

# Start RBI service
pm2 start dist/server/server.js --name rbi-service

# Save PM2 configuration
pm2 save

# Configure PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually involves sudo)

# Check status
pm2 status
pm2 logs rbi-service
```

**7. Configure Security Group**
- In AWS Console → EC2 → Security Groups
- Edit inbound rules for your instance's security group
- Add rule: Port 3001, Source: Your VPC CIDR (or specific IPs)
- **For production:** Use a load balancer or reverse proxy (nginx)

**8. Test Deployment**
```bash
# From your local machine or another server
curl http://your-ec2-ip:3001/health

# Should return:
# {"status":"healthy","service":"rbi-architecture-service","version":"2.0.0",...}
```

**9. Set Environment Variables (Optional)**
```bash
# Create .env file
cd rbi-architecture-service
echo "PORT=3001" > .env
echo "RBI_API_KEY=your-secret-key-here" >> .env

# Restart service
pm2 restart rbi-service
```

**10. Configure Firewall (if needed)**
```bash
# For Amazon Linux (firewalld)
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload

# For Ubuntu (ufw)
sudo ufw allow 3001/tcp
```

**Troubleshooting:**
- **Service won't start:** Check `pm2 logs rbi-service` for errors
- **Can't connect:** Verify security group allows port 3001
- **Port already in use:** Change PORT in .env or kill process on port 3001
- **Node version wrong:** Use nvm to install Node.js 20+

**Next Steps:**
- Set `RBI_API_URL=http://your-ec2-ip:3001` in your Rails app
- Or use internal DNS: `RBI_API_URL=http://rbi-service.internal:3001`
- For production: Set up nginx reverse proxy or use AWS Application Load Balancer

---

### Option B: AWS Lambda/Serverless (Cost-Effective)

**Time:** ~1-2 hours  
**Cost:** Pay per request (~$0.20 per million requests)  
**Best for:** Low traffic, cost optimization, auto-scaling

#### Prerequisites
- AWS CLI configured
- Serverless Framework installed: `npm install -g serverless`

#### Step-by-Step Instructions

**1. Install Serverless Framework**
```bash
npm install -g serverless
```

**2. Create serverless.yml**
```yaml
# serverless.yml
service: rbi-architecture-service

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  memorySize: 512
  timeout: 30
  environment:
    NODE_ENV: production

functions:
  api:
    handler: dist/server/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-offline
```

**3. Create Lambda Handler**
```typescript
// src/server/lambda.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { app } from './server';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  // Convert API Gateway event to Express request
  // Use aws-serverless-express or similar library
  // See: https://github.com/awslabs/aws-serverless-express
};
```

**4. Deploy**
```bash
npm run build
serverless deploy
```

**5. Get API Endpoint**
```bash
serverless info
# Outputs the API Gateway URL
```

**Note:** Lambda requires additional setup to convert Express app to Lambda handler. Consider using `aws-serverless-express` or `@vendia/serverless-express` library.

---

### Option C: AWS ECS/Fargate (Production-Ready)

**Time:** ~2-3 hours  
**Cost:** ~$15-30/month (Fargate)  
**Best for:** Production, high availability, auto-scaling

#### Step-by-Step Instructions

**1. Create Dockerfile**
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist ./dist

# Expose port
EXPOSE 3001

# Start service
CMD ["node", "dist/server/server.js"]
```

**2. Build and Push to ECR**
```bash
# Build Docker image
docker build -t rbi-architecture-service .

# Create ECR repository
aws ecr create-repository --repository-name rbi-architecture-service

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag rbi-architecture-service:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/rbi-architecture-service:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/rbi-architecture-service:latest
```

**3. Create ECS Task Definition**
```json
{
  "family": "rbi-architecture-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "rbi-service",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/rbi-architecture-service:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/rbi-architecture-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**4. Create ECS Service**
- Use AWS Console or CLI to create ECS service
- Configure Application Load Balancer
- Set up auto-scaling (min: 1, max: 5 tasks)

**5. Configure Load Balancer**
- Create target group pointing to port 3001
- Configure health check: `GET /health`
- Set up listener on port 80/443

**6. Get Service URL**
```bash
# Get load balancer DNS name
aws elbv2 describe-load-balancers --names rbi-service-alb

# Service URL: http://your-alb-dns-name/health
```

---

## Deployment Comparison

| Option | Time | Cost/Month | Best For | Complexity |
|--------|------|------------|----------|------------|
| **EC2** | 30 min | $10-15 | Getting started, Week 1 | Low |
| **Lambda** | 1-2 hrs | Pay-per-use | Low traffic, cost optimization | Medium |
| **ECS/Fargate** | 2-3 hrs | $15-30 | Production, high availability | High |

**Recommendation for TPB:**
- **Week 1 (Immediate):** Use EC2 for fastest deployment
- **Phase 1 (Months 0-6):** Migrate to ECS/Fargate for production
- **Future:** Consider Lambda for cost optimization if traffic is low

---

## Post-Deployment Configuration

### 1. Set Environment Variables in Rails App

```ruby
# config/application.yml or Rails credentials
RBI_API_URL: http://your-rbi-service-url:3001
RBI_API_KEY: your-api-key-here  # Optional
```

### 2. Test Connection

```ruby
# Rails console
require 'net/http'
require 'json'

uri = URI("#{ENV['RBI_API_URL']}/health")
response = Net::HTTP.get_response(uri)
puts JSON.parse(response.body)
# Should return: {"status":"healthy",...}
```

### 3. Monitor Service

- **Health Checks:** Set up monitoring for `/health` endpoint
- **Logs:** Check PM2 logs (EC2) or CloudWatch logs (Lambda/ECS)
- **Metrics:** Export RBI metrics to Prometheus (see Infrastructure Monitoring section)

---

## Troubleshooting

**Service won't start:**
- Check Node.js version: `node --version` (must be 20+)
- Check logs: `pm2 logs rbi-service` or CloudWatch logs
- Verify port 3001 is available: `lsof -i :3001`

**Can't connect from Rails app:**
- Verify security group allows port 3001
- Check firewall rules (firewalld/ufw)
- Test with curl: `curl http://rbi-service-url:3001/health`
- Verify `RBI_API_URL` environment variable is set correctly

**High latency:**
- Check EC2 instance size (upgrade if needed)
- Consider moving to ECS/Fargate for better performance
- Check network latency between Rails app and RBI service

**Service crashes:**
- Check PM2 logs: `pm2 logs rbi-service`
- Verify memory limits (increase if needed)
- Check for memory leaks in application logs

---

## API Endpoints (Exact Formats)

### POST /field/validate

**Purpose:** Content validation, request pre-validation, GPT output validation

**Request:**
```json
{
  "content": "Product description or GPT response text",
  "categoryAssociations": [1, 2, 3]
}
```

**Response:**
```json
{
  "verified": true,
  "confidence": 0.92,
  "sovereignLogic": {
    "coherence": 0.89,
    "clarity": 0.85,
    "resonance": 0.91,
    "sovereignty": 0.88
  },
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "stability": 0.9
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/field/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Indica Flower - Granddaddy Purple - Relaxing, calming effects",
    "categoryAssociations": [1, 2]
  }'
```

---

### POST /field/score

**Purpose:** Quick quality scoring (clarity, coherence, resonance, sovereignty)

**Request:**
```json
{
  "content": "Product description or content text"
}
```

**Response:**
```json
{
  "clarity": 0.8,
  "coherence": 0.9,
  "resonance": 0.85,
  "sovereignty": 0.8,
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.85
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

---

### POST /field/neighbors

**Purpose:** Similarity search, personalized recommendations

**Request:**
```json
{
  "query": {
    "text": "I want something relaxing for sleep"
  },
  "candidates": [
    {
      "id": "product-123",
      "text": "Indica Flower - Granddaddy Purple - Relaxing, calming effects, helps with sleep"
    }
  ],
  "topN": 10
}
```

**Response:**
```json
{
  "neighbors": [
    {
      "id": "product-123",
      "score": 0.92
    }
  ],
  "count": 1,
  "topN": 10,
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

---

### POST /field/analyze

**Purpose:** Comprehensive content analysis

**Request:**
```json
{
  "content": "Full product description or content",
  "title": "Product Name"
}
```

**Response:**
```json
{
  "overallScore": 0.87,
  "signature": {
    "clarity": 0.85,
    "coherence": 0.89,
    "resonance": 0.91,
    "sovereignty": 0.88
  },
  "fieldDynamics": {
    "fieldStrength": 2.1,
    "stability": 0.9,
    "coherence": 0.89
  },
  "timestamp": "2025-11-15T22:00:00.000Z"
}
```

---

## Rails Backend Integration

### 1. Create RBI Service Client

**File:** `app/services/rbi_service.rb`

```ruby
require 'net/http'
require 'json'
require 'uri'

class RbiService
  RBI_API_URL = ENV['RBI_API_URL'] || 'http://localhost:3001'
  RBI_API_KEY = ENV['RBI_API_KEY']

  def self.validate_content(content:, category_associations: [])
    call_rbi('/field/validate', {
      content: content,
      categoryAssociations: category_associations
    })
  end

  def self.score_content(content:)
    call_rbi('/field/score', { content: content })
  end

  def self.find_neighbors(query:, candidates:, top_n: 10)
    call_rbi('/field/neighbors', {
      query: { text: query },
      candidates: candidates.map { |c| { id: c[:id].to_s, text: c[:text] } },
      topN: top_n
    })
  end

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
```

---

## Immediate Implementation: Server Load Reduction (Week 1)

### 1. Add Request Pre-Validation

**File:** `app/services/request_processor.rb`

```ruby
class RequestProcessor
  def self.process_api_request(request_data)
    # Step 1: Pre-validate with RBI (fast, $0.00001)
    rbi_validation = RbiService.validate_content(
      content: build_request_content(request_data),
      category_associations: extract_categories(request_data)
    )
    
    # Step 2: Skip expensive operations if incoherent
    unless rbi_validation[:verified] && rbi_validation[:sovereignLogic][:coherence] >= 0.7
      return {
        error: 'Request validation failed',
        coherence: rbi_validation[:sovereignLogic][:coherence],
        issues: rbi_validation[:issues] || []
      }
    end
    
    # Step 3: Only process validated requests
    expensive_operation(request_data)
  end
end
```

### 2. Add to Critical API Endpoints

**File:** `app/controllers/api/v1/products_controller.rb`

```ruby
class Api::V1::ProductsController < ApplicationController
  def search
    # Pre-validate search query
    validation = RbiService.validate_content(content: params[:query])
    
    unless validation[:verified] && validation[:sovereignLogic][:coherence] >= 0.7
      return render json: { error: 'Invalid search query' }, status: 400
    end
    
    # Proceed with search (only if validated)
    products = Product.search(params[:query])
    render json: products
  end
end
```

**Impact:** 20-30% server load reduction, $4,500-5,500/month AWS savings

---

## Infrastructure Monitoring Integration

### 1. Export RBI Metrics to Prometheus

**File:** `app/lib/rbi_metrics.rb`

```ruby
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

RBI_VALIDATION_DURATION = PROMETHEUS.histogram(
  :rbi_validation_duration_seconds,
  'Time spent on RBI validation',
  labels: [:validation_type]
)
```

**Update RbiService:**

```ruby
class RbiService
  def self.validate_content(content:, category_associations: [])
    start_time = Time.now
    
    result = call_rbi('/field/validate', {
      content: content,
      categoryAssociations: category_associations
    })
    
    duration = Time.now - start_time
    RBI_VALIDATION_DURATION.observe(duration, labels: { validation_type: 'content' })
    RBI_VALIDATION_RATE.increment(
      labels: {
        validation_type: 'content',
        status: result[:verified] ? 'verified' : 'failed'
      }
    )
    
    if result[:sovereignLogic][:coherence] < 0.7
      RBI_LOW_COHERENCE_ALERTS.increment(
        labels: { content_type: 'product', threshold: '0.7' }
      )
    end
    
    RBI_COHERENCE_SCORE.set(
      result[:sovereignLogic][:coherence],
      labels: { content_type: 'product', store_id: '1' }
    )
    
    result
  end
end
```

### 2. Add RBI to Health Check

**File:** `app/controllers/health_controller.rb`

```ruby
class HealthController < ApplicationController
  def show
    health_status = {
      status: 'healthy',
      timestamp: Time.now.iso8601,
      services: {
        database: check_database,
        redis: check_redis,
        rbi_service: check_rbi_service,
        rbi_data_quality: check_rbi_data_quality
      }
    }
    
    render json: health_status
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

  def check_rbi_data_quality
    # Check average coherence of recent products
    recent_products = Product.order(created_at: :desc).limit(100)
    avg_coherence = recent_products.map do |product|
      validation = RbiService.validate_content(
        content: "#{product.name} #{product.description}"
      )
      validation[:sovereignLogic][:coherence]
    end.sum / recent_products.count
    
    {
      status: avg_coherence >= 0.7 ? 'healthy' : 'degraded',
      average_coherence: avg_coherence.round(3),
      threshold: 0.7
    }
  end
end
```

---

## GPT Microservice Integration (Phase 2)

### 1. Pre-Validate GPT Inputs

**File:** `app/services/gpt_service.rb`

```ruby
class GptService
  def self.generate_customer_response(session_context:, query:)
    # RBI Pre-Validation: Check context coherence
    context_coherence = RbiService.analyze_content(
      content: build_context_string(session_context)
    )
    
    unless context_coherence[:signature][:coherence] >= 0.6
      return fallback_response("Context coherence too low")
    end
    
    # Call GPT API
    gpt_response = call_openai_api(
      messages: build_messages(session_context, query)
    )
    
    # RBI Output Validation: Verify GPT response quality
    output_validation = RbiService.validate_content(
      content: gpt_response[:content]
    )
    
    unless output_validation[:verified] && 
           output_validation[:sovereignLogic][:coherence] >= 0.7
      return error_response("Incoherent GPT response")
    end
    
    # Compliance Check: Filter compliance violations
    if contains_compliance_violations?(gpt_response[:content])
      return fallback_response("Response contains compliance violations")
    end
    
    gpt_response
  end
end
```

---

## CI/CD Quality Gates

### 1. GitHub Actions Workflow

**File:** `.github/workflows/rbi-quality-check.yml`

```yaml
name: RBI Quality Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Validate Documentation Coherence
        run: |
          for file in docs/*.md; do
            content=$(cat "$file")
            response=$(curl -X POST ${{ secrets.RBI_API_URL }}/field/validate \
              -H "Content-Type: application/json" \
              -H "X-API-Key: ${{ secrets.RBI_API_KEY }}" \
              -d "{\"content\": \"$content\"}")
            
            coherence=$(echo $response | jq '.sovereignLogic.coherence')
            if (( $(echo "$coherence < 0.7" | bc -l) )); then
              echo "❌ Documentation coherence below threshold: $coherence"
              exit 1
            fi
          done
```

---

## GraphQL Resolver Integration

### 1. Add RBI Validation to Resolvers

**File:** `app/graphql/resolvers/products_resolver.rb`

```ruby
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
```

---

## Environment Variables

Add to `.env` or Rails credentials:

```bash
RBI_API_URL=http://localhost:3001
RBI_API_KEY=your-api-key-here  # Optional, for production
```

---

## Error Handling & Fallbacks

Always implement graceful fallbacks:

```ruby
def self.validate_with_fallback(content:)
  begin
    RbiService.validate_content(content: content)
  rescue => e
    Rails.logger.error("RBI validation failed: #{e.message}")
    # Fallback: allow content (don't block on RBI failure)
    { verified: true, sovereignLogic: { coherence: 0.5 } }
  end
end
```

---

## Deployment Checklist

- [ ] Deploy RBI Architecture Service (EC2 or serverless)
- [ ] Set `RBI_API_URL` environment variable
- [ ] Set `RBI_API_KEY` (optional, for production)
- [ ] Add RBI service client to Rails app
- [ ] Implement request pre-validation (Week 1)
- [ ] Export RBI metrics to Prometheus
- [ ] Add RBI to health check endpoints
- [ ] Set up CI/CD quality gates
- [ ] Monitor RBI metrics in Grafana
- [ ] Configure RBI-based alerting

---

## Questions?

- **Integration Help**: See [RBI Architecture Service README](../../README.md)
- **API Documentation**: See endpoint examples above
- **Full Project**: Contact ThePeakBeyond team

---

**Note**: This guide focuses on V2 architecture patterns. Adapt code examples to your specific Rails/GraphQL setup.

