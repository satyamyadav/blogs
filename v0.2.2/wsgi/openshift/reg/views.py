# Create your views here.
import os
from django.shortcuts import render_to_response

def reg(request):
    return render_to_response('reg/reg.html')