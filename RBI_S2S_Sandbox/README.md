# RBI S2S Sandbox

**Temporary workspace for exploring partner projects and creating RBI integration guides**

---

## Purpose

This directory is a **temporary workspace** for:
1. **Exploring partner projects** - Clone or copy partner codebases here for analysis
2. **Creating RBI assessments** - Analyze how RBI can add value to their projects
3. **Writing integration guides** - Document step-by-step RBI integration instructions
4. **Testing RBI integration** - Validate RBI works with their specific use cases

**Once assessment and guides are complete, full project codebases can be deleted from here.**

---

## Workflow

### 1. Add Partner Project
```bash
# Clone partner's project
cd RBI_S2S_Sandbox
git clone https://github.com/partner/project.git project-name
# OR copy project files here
```

### 2. Explore & Analyze
- Review project structure and workflows
- Identify RBI integration opportunities
- Test RBI integration locally

### 3. Create Documentation
Create in the project directory:
- `RBI_VALUE_ASSESSMENT.md` - ROI analysis and benefits
- `RBI_IMPLEMENTATION_GUIDE.md` - Step-by-step integration guide
- Test integration code

### 4. Extract to RBI-Kernel
Move documentation to `RBI-Kernel/examples/`:
```bash
# Copy RBI-specific docs to examples
cp project-name/RBI_VALUE_ASSESSMENT.md RBI-Kernel/examples/project-name/
cp project-name/RBI_IMPLEMENTATION_GUIDE.md RBI-Kernel/examples/project-name/
# Create minimal integration snippet
# Create README.md in examples folder
```

### 5. Clean Up
```bash
# Delete full project (it remains in partner's repo)
rm -rf project-name/
```

**Result:** Partners access RBI integration guides in `RBI-Kernel/examples/` without needing full project code.

---

## Current Projects

### little-hero-books-main
**Status:** ✅ Assessment and guide complete  
**Next:** Extract to `RBI-Kernel/examples/little-hero-books/` (if not already done)

- `RBI_VALUE_ASSESSMENT.md` - Complete value analysis
- `RBI_IMPLEMENTATION_GUIDE.md` - Complete integration guide

---

## Best Practices

1. **Keep it temporary** - Don't commit full partner projects to this repo
2. **Extract useful parts** - Move only RBI documentation to `RBI-Kernel/examples/`
3. **Link to partner repos** - Examples should link to partner's repository for full code
4. **Clean up regularly** - Delete projects after assessment/guide creation
5. **Minimal code examples** - Only include RBI integration snippets, not full projects

---

## Structure

```
RBI_S2S_Sandbox/
  ├── README.md (this file)
  ├── SANDBOX_TUTORIAL.md (future: RBI sandbox tool docs)
  ├── example-usage.ts (RBI usage examples)
  └── [project-name]/ (temporary - delete when done)
      ├── [full project code]
      ├── RBI_VALUE_ASSESSMENT.md
      └── RBI_IMPLEMENTATION_GUIDE.md
```

---

## Notes

- **Full project codebases** remain in partner repositories
- **RBI-Kernel examples** contain only integration guides and minimal code
- **This sandbox** is for temporary exploration and documentation creation
- **Partners access** RBI integration info via `RBI-Kernel/examples/`, not this sandbox

---

**Remember:** This is a workspace, not a permanent archive. Extract useful parts, then clean up!
