from django.conf.urls import patterns, include, url



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    
    url(r'^$', 'projects.views.projects', name='projects'),
    url(r'scrietapp/', 'projects.views.scrietapp', name='scrietapp'),
)



