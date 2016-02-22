from django.conf.urls import patterns, include, url



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    
    url(r'^$', 'reg.views.reg', name='reg'),
    
)



