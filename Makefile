.PHONY: frontend backend dev install

frontend:
	cd frontend && npm run dev

backend:
	cd backend && source .venv/bin/activate && python manage.py runserver

dev:
	make -j2 frontend backend

install:
	cd frontend && npm install
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install django djangorestframework django-cors-headers gunicorn

seed:
	python backend/manage.py seed_demo

reset-db:
	rm -f backend/db.sqlite3
	cd backend && python manage.py migrate
	cd backend && python manage.py seed_demo