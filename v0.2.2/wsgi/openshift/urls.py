from django.conf.urls import patterns, include, url
from django.conf import settings
#from django.conf.urls.defaults import *
#from blog.views import BlogView
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'openshift.views.home', name='home'),
    url(r'^projects/', include('projects.urls')),
    #url(r'^blog/', 'blog.views.blog', name='blog'),
    #(r'^blog/', BlogView.as_view()),
    url(r'^blog/', include('blog.urls')),
    url(r'^reg/', include('reg.urls')),
    # url(r'^openshift/', include('openshift.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)




