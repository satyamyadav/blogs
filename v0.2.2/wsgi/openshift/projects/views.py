import os
from django.shortcuts import render_to_response

def projects(request):
    return render_to_response('projects/projects.html')


def scrietapp(request):
    return render_to_response('projects/main.html')    
    
    
 
