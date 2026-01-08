# Pokretanje:
## Pokrenuti redis:  
 1) ako nemas uradi docker compose up 
 2) ako imas samo pokreni u docker desktopu
## Zatim pokrenuti servis
- poetry run python run.py
## Nakon toga novi terminal otvoriti i upisati za pokretanje workera
- celery -A app.tasks.celery worker --loglevel=info --pool=solo

# Kako i sta radi
Imamo mikroservis koji izvrsava primanje mejlova potadataka za slanje sa fronta i zatim ih parsira i salje u Redis queue.
Redis queue nam omogucava da se mejlovi salju asihrono i da ne blokiraju ceo rad samo servisa, a Celery workeri nam sluze
da preuzmu podatke za slanje i posalju taj mejl nezavisno od ostatka aplikacije