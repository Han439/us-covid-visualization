from django.urls import path, include
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('api/map/', views.MapAPI.as_view(), name='map-api'),
	path('api/grow/', views.GrowRate.as_view(), name='grow-rate'),
	path('api/death/', views.DeathRate.as_view(), name='death-rate'),
]