from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from .models import User, Widget
from django.urls import reverse, reverse_lazy
from django.views import generic
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.admin.widgets import AdminDateWidget
# Create your views here.
@login_required
def index(request):
    Users = User.objects.order_by('-added_date')[:]
    template = loader.get_template('Users/index.html')
    context = {
        'Users': Users,
    }
    return HttpResponse(template.render(context, request))


class IndexView(LoginRequiredMixin,generic.ListView):
    template_name = 'Users/index.html'
    login_url = '/accounts/login/'
    redirect_field_name = 'redirect_to'
    context_object_name = 'latest_user_list'
    def get_queryset(self):
        users = User.objects.all()
        dict_of_users = {}
        for user in users:
            cur_dict = {}
            cur_dict['id'] = user.id
            appList = []
            for widget in user.widget_set.all():
                appList.append(widget.appname)
            cur_dict['apps'] = appList
            dict_of_users[user.username] = cur_dict
        with open("users.json","w") as f:
            json.dump(dict_of_users, f)


        """Return the last five published questions."""
        return User.objects.order_by('-added_date')[::-1]

def SetCurrentUser(request, user_id):
    user = get_object_or_404(User, pk = user_id)
    with open("currentuser.txt", "w") as f:
        f.write(user.username)
    return render(request, 'Users/detail.html', {'User':user})

class DetailView(generic.DetailView):
    model = User
    template_name = 'Users/detail.html'

def detail(request, user_id):
    user = get_object_or_404(User, pk = user_id)
    return render(request, 'Users/detail.html', {'User': user})

def widgets(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    return render(request, 'Users/widgets.html', {'user': user})

class WidgetView(generic.DetailView):
    model = Widget
    template_name = 'Users/widgets.html'

def pickWidgets(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    try:
        selected_choice = user.widget_set.get(pk=request.POST['widget'])
    except (KeyError, Widget.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'Users/detail.html', {
            'User': user,
            'error_message': "You didn't select an app.",
        })
    else:
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        print(selected_choice)
        return HttpResponseRedirect(reverse('Users:results', args=(selected_choice.id,)))

class addUser(generic.edit.CreateView):
    model = User
    fields = ['username']
    def get_absolute_url(self):
        return reverse('')

class addWidget(generic.edit.CreateView, generic.ListView):
    model = Widget
    fields = ['appname', 'user', 'creator']
    def get_absolute_url(self):
        return reverse('Users:index')
    #context_object_name = 'pertinent'
    #def get_queryset(self):
    #    apps = []
    #    with open("apps.txt", "r") as f:
    #        apps = f.readlines()
        #print(apps)
        #return Widget.objects.order_by('-added_date', 'user')[::-1]
        #return(apps, User.objects.order_by('added_date')[::-1])

    def get_context_data(self, **kwargs):
        apps = []
        with open("apps.json", "r") as f:
            apps = json.load(f)
        context = super(addWidget, self).get_context_data(**kwargs)
        #context['latest_widget_list'] = Widget.objects.order_by('-added_date', 'user')[::-1]
        context['latest_widget_list'] = apps
        context['latest_user_list'] = User.objects.order_by('added_date')[::]

        return context

class remWidget(generic.edit.DeleteView):
    model = Widget
    template_name = 'Users/delete_widget.html'
    def get_success_url(self):
        return reverse('Users:index')

class remUser(generic.edit.DeleteView): 
    model = User
    template_name = 'Users/delete_user.html'
    def get_success_url(self):
        return reverse('Users:index')


