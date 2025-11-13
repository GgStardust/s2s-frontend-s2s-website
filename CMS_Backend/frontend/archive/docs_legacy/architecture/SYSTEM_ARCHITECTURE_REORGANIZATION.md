# **System Architecture Reorganization Plan**

## **🎯 Current Issues**

1. **Mixed Concerns**: Core system files scattered between `lib/`, root, and `scripts/`
2. **No Clear Separation**: System architecture, content, and implementation mixed
3. **Developer Confusion**: New developers struggle to understand system structure
4. **Documentation Scattered**: Specs and architecture docs in root instead of organized folders

## **🏗️ Proposed Structure**

```
CLEANED_SYSTEM/
├── 01_CORE_FRAMEWORK/           # ✅ Already well organized
│   ├── CANONICAL_13_ORB_SYSTEM_REFERENCE.md
│   ├── codex_Orb_Synthesis_Final.md
│   └── ...
│
├── 02_SYSTEM_ARCHITECTURE/      # 🔄 Rename from 03_SYSTEM_ARCHITECTURE
│   ├── 01_System_Architecture_Overview.md
│   ├── 02_Dashboard_Module_Specifications.md
│   ├── 03_Dashboard_Anchoring_Modules.md
│   ├── 04_User_Flows_System_Integration.md
│   ├── 05_Orb_Type_System/      # 🆕 NEW: Move Orb Type Kernel here
│   │   ├── orb-type-kernel.ts
│   │   ├── orb-type-kernel.spec.md
│   │   ├── orb-type-kernel.test.ts
│   │   └── orb-type-kernel-architecture.md
│   ├── 06_Resonance_Engine/     # 🆕 NEW: Move Resonance Engine here
│   │   ├── resonance-engine.ts
│   │   ├── resonance-api.ts
│   │   ├── resonance-integration.test.ts
│   │   └── resonance-engine-integration.md
│   └── 07_API_Specifications/   # 🆕 NEW: API specs and routes
│       ├── api-routes.md
│       ├── resonance-api-spec.md
│       └── integration-examples.md
│
├── 03_IMPLEMENTATION/           # 🆕 NEW: All production code
│   ├── frontend/                # 🆕 NEW: Frontend implementation
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   ├── backend/                 # 🆕 NEW: Backend implementation
│   │   ├── api/
│   │   ├── services/
│   │   └── ...
│   ├── shared/                  # 🆕 NEW: Shared utilities
│   │   ├── types/
│   │   ├── utils/
│   │   └── ...
│   └── scripts/                 # 🆕 NEW: Build and deployment scripts
│       ├── build/
│       ├── deploy/
│       └── demo/
│
├── 04_CONTENT/                  # 🆕 NEW: All content and processed files
│   ├── processed/               # Move from 09_PROCESSED
│   ├── templates/               # Move from root
│   ├── data/                    # Move from root
│   └── ...
│
├── 05_DESIGN_SYSTEM/            # 🔄 Rename from 04_BRAND_GUIDELINES
│   ├── 01_Brand_Guidelines.md
│   ├── 02_Design_System_Specs.md
│   ├── 03_Merged_Brand_Guidelines.md
│   ├── 04_Accessibility_Audit_Report.md
│   ├── assets/                  # Move Glyphs and orb_glyphs here
│   └── design-tokens.ts         # Move from design-system/
│
├── 06_IMPLEMENTATION_PLANS/     # 🔄 Rename from 05_IMPLEMENTATION_PLANS
│   ├── **Complete S2S Platform Implementation Plan**
│   ├── FINAL_S2S_IMPLEMENTATION_PLAN_ENHANCED.md
│   └── ...
│
├── 07_FUTURE_INTEGRATIONS/      # 🔄 Rename from 08_FUTURE_INTEGRATIONS
│   └── ...
│
├── 08_ARCHIVE/                  # 🔄 Rename from 10_ARCHIVE
│   └── ...
│
└── docs/                        # 🆕 NEW: All documentation
    ├── deployment/
    ├── development/
    ├── architecture/
    └── api/
```

## **🔄 Migration Plan**

### **Phase 1: Create New Structure**
1. Create new directories
2. Move system architecture files
3. Move implementation files
4. Move content files

### **Phase 2: Update Imports**
1. Update all import paths
2. Update configuration files
3. Update documentation references

### **Phase 3: Clean Up**
1. Remove old directories
2. Update .gitignore
3. Update README files

## **🎯 Benefits**

1. **Clear Separation**: System architecture, implementation, and content are separate
2. **Developer Friendly**: New developers can easily understand the structure
3. **Scalable**: Easy to add new components and features
4. **Maintainable**: Clear ownership and responsibility for each area
5. **Professional**: Follows industry best practices for project organization

## **📁 File Mapping**

### **Current → Proposed**

| Current Location | Proposed Location | Reason |
|------------------|-------------------|---------|
| `lib/orb-type-kernel.ts` | `02_SYSTEM_ARCHITECTURE/05_Orb_Type_System/` | Core system architecture |
| `lib/resonance-engine.ts` | `02_SYSTEM_ARCHITECTURE/06_Resonance_Engine/` | Core system architecture |
| `lib/resonance-api.ts` | `02_SYSTEM_ARCHITECTURE/06_Resonance_Engine/` | Core system architecture |
| `app/api/resonance/route.ts` | `03_IMPLEMENTATION/backend/api/` | Production implementation |
| `scripts/demo-resonance-integration.ts` | `03_IMPLEMENTATION/scripts/demo/` | Implementation script |
| `ORB_TYPE_KERNEL_SPEC.md` | `02_SYSTEM_ARCHITECTURE/05_Orb_Type_System/` | System specification |
| `RESONANCE_ENGINE_INTEGRATION.md` | `02_SYSTEM_ARCHITECTURE/06_Resonance_Engine/` | System documentation |
| `09_PROCESSED/` | `04_CONTENT/processed/` | Content files |
| `templates/` | `04_CONTENT/templates/` | Content templates |
| `data/` | `04_CONTENT/data/` | Content data |

## **🚀 Implementation Steps**

1. **Create new directory structure**
2. **Move files to appropriate locations**
3. **Update import paths and references**
4. **Update documentation**
5. **Test that everything still works**
6. **Clean up old directories**

This reorganization will make the project much more professional and developer-friendly!
