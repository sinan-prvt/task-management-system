from django.urls import path
from .views import (
    TaskCreateView,
    TaskListView,
    TaskUpdateView,
    TaskDeleteView
)


urlpatterns = [
    path('tasks/', TaskCreateView.as_view()),
    path('tasks/list/', TaskListView.as_view()),
    path('tasks/<int:pk>/', TaskUpdateView.as_view()),
    path('tasks/delete/<int:pk>/', TaskDeleteView.as_view()),
]


