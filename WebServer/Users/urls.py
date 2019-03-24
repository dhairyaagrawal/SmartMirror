from django.urls import path
from . import views

app_name = 'Users'
urlpatterns = [
    #ex /Users/
    path('',views.IndexView.as_view(), name='index'),
    #path('', views.index, name='index'),
    #ex /Users/Ryan/
    #path('<int:user_id>/', views.detail, name='detail'),
    path('<int:pk>/', views.DetailView.as_view(), name='detail'),
    #ex /Users/Ryan/Widgets
    #path('<int:user_id>/Widgets/', views.widgets, name='widgets'),
    path('removeWidget/<int:pk>/', views.remWidget.as_view(), name='remwidget'),
    #ex /Users/Ryan/edit
    #path('<int:user_id>/edit/', views.pickWidgets, name='edit')
    path('<int:user_id>/edit/', views.pickWidgets, name='edit'),
    #ex /Users/add_user
    path('adduser/', views.addUser.as_view(success_url=""), name='adduser'),
    #ex /Users/add_widget
    path('updatewidgets/', views.addWidget.as_view(success_url=""), name='addwidget'),
    #ex /Users/Ryan/set/
    path('<int:user_id>/set/', views.SetCurrentUser, name='set'),
    #ex /Users/remove_user
    path('<int:pk>/remove_user/', views.remUser.as_view(), name='remuser'),
    #ex /Users/add_stock
    path('add_stock/', views.addStock.as_view(success_url=''), name='addstock'),
    #ex /Users/rem_stock
    path('rem_stock/<int:pk>/', views.remStock.as_view(success_url=''), name='remstock'),
]
