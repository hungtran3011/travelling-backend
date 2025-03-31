# Makefile for NestJS Scaffolding
# Usage:
#  make new name=yourComponentName
#
# This command will create:
#   - A module: nest g module yourComponentName
#   - A controller: nest g controller yourComponentName
#   - A service: nest g service yourComponentName

ifndef name
$(error "You must specify a name. Example: make new name=example")
endif

.PHONY: new module controller service

new: module controller service dto

module:
	@echo "Generating module: $(name)"
	@nest generate module $(name)

controller:
	@echo "Generating controller: $(name)"
	@nest generate controller $(name)

service:
	@echo "Generating service: $(name)"
	@nest generate service $(name)

dto:
	@echo "Generating DTO: $(name)"
	@nest generate class $(name)/dto/$(name).dto --no-spec --flat