.PHONY: help about args list targets services build up down rebuild clean start status ps logs stop restart sh bash shell
DOCKER         := docker
DOCKER_COMPOSE := docker-compose

COMPOSE_FILE_DEFAULT_NAME := docker-compose.yml
CONTAINER_DEFAULT := 
SHELL_CMD := bash
ME := $(realpath $(firstword $(MAKEFILE_LIST)))
PWD := $(dir $(ME))
container ?= $(CONTAINER_DEFAULT)
file      ?= $(PWD)infra/$(COMPOSE_FILE_DEFAULT_NAME)
service   ?=
services  ?= $(service)

.DEFAULT_GOAL := help

##
# help
# Displays a (hopefully) useful help screen to the user
#
# NOTE: Keep 'help' as first target in case .DEFAULT_GOAL is not honored
#
help: about targets args ## This help screen
ifeq ($(CONTAINER_DEFAULT),)
	$(warning WARNING: CONTAINER_DEFAULT is not set. Please edit makefile)
endif

about:
	@echo
	@echo "Makefile to help manage docker-compose services"

args:
	@echo
	@echo "Target arguments:"
	@echo
	@echo "    " "file"      "\t" "Location of docker-compose file (default = './$(COMPOSE_FILE_DEFAULT_NAME)')"
	@echo "    " "service"   "\t" "Target service for docker-compose actions (defauilt = all services)"
	@echo "    " "services"  "\t" "Target services for docker-compose actions (defauilt = all services)"
	@echo "    " "container" "\t" "Target container for docker actions (default = '$(CONTAINER_DEFAULT)')"


services: ## Lists services
	@$(DOCKER_COMPOSE) -f "$(file)" ps --services

build: ## Builds service images [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" build $(c)

up: ## Starts containers (in detached mode) [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" up --detach $(c)

down: ## Removes containers (preserves images and volumes) [file]
	@$(DOCKER_COMPOSE) -f "$(file)" down $(c)

rebuild: down build ## Stops containers (via 'down'), and rebuilds service images (via 'build')

clean: ## Removes containers, images and volumes [file]
	@$(DOCKER_COMPOSE) -f "$(file)" down --volumes --rmi all

start: ## Starts previously-built containers (see 'build') [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" start $(c)

rm: ## Starts previously-built containers (see 'build') [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" stop $(c)
	@$(DOCKER_COMPOSE) -f "$(file)" rm -f $(c)

status: ps ## see 'ps'
ps:        ## Shows status of containers [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" ps

logs:  ## Shows output of running containers (in 'follow' mode) [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" logs --tail=100 -f $(c)

stop: ## Stops containers (without removing them) [file|service|services]
	@$(DOCKER_COMPOSE) -f "$(file)" stop $(c)

restart: stop start ## Stops containers (via 'stop'), and starts them again (via 'start')

sh: ##
	@$(DOCKER_COMPOSE) -f "$(file)" exec $(c) bash

api-deps: ##
	cd ./api && npm i;



