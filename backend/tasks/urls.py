from django.urls import path
from .views import TaskCreateView, TaskListView


urlpatterns = [
    path('tasks/', TaskCreateView.as_view()),
    path('tasks/list/', TaskListView.as_view()),
]


