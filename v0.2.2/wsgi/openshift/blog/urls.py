from django.conf.urls import patterns, include, url
from django.views.generic import ListView, DetailView
from blog.models import Post

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    url(r'^$', ListView.as_view (
                           queryset=Post.objects.all().order_by("-created")[:10],
                           template_name="blog/blog.html")),


    url(r'^(?P<pk>\d+)$', DetailView.as_view(
                           model=Post,
                           template_name="blog/post.html")),
)



