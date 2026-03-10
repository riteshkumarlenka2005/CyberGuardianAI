# CyberGuardian AI - AI Module

AI/ML components for the CyberGuardian AI platform.

## Components

### Prompts
- `scammer_prompts/` - Prompt templates for scam simulation
- `mentor_prompts/` - Prompt templates for mentoring intervention

### Engines
- `scenario_engine/` - Scenario loading and routing logic
- `mentor_engine/` - Explanation and feedback generation
- `risk_detection/` - Keyword and pattern-based risk scoring

### LLM Integration
- `llm/` - LLM client wrappers and response parsing

## Usage

These modules are consumed by the server backend to:
1. Generate realistic scammer dialogues
2. Analyze user responses for risk
3. Provide contextual mentor feedback
