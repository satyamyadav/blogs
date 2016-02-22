from django.db import models

# Create your models here.




class Reg(models.Model):
    part_id = models.AutoField(max_length=9, primary_key = True)
    part_name = models.CharField(max_length=100)
    part_contact = models.IntegerField(max_length=10)
    

    

    
    
    
    
    def __unicode__(self):
        return self.part_name