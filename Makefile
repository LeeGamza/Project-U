NAME=tripstory
NGINX_SETUP_FILE=nginx/setup.sh
NGINX_CERTS_DIR=nginx/certs/

all: $(NAME)

$(NAME) : up

up: setup
		docker-compose up --build -d

setup: 
	sh $(NGINX_SETUP_FILE)

down: 
	docker-compose down

clean:
	docker-compose down -v -rmi all

fclean: 
	rm -rf $(NGINX_CERTS_DIR)
	docker system prune -f

re:
	make fclean
	make all

.PHONY: all up down clean fclean re cert