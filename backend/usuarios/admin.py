from django.contrib import admin

from .models import Exercicio, Rotina, RotinaExercicio, Usuario

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Exercicio)
admin.site.register(Rotina)
admin.site.register(RotinaExercicio)
