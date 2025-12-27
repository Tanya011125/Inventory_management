from django.db import models

class SpareItem(models.Model):
    item_part_no = models.CharField(max_length=100, unique=True)
    item_name = models.CharField(max_length=200)
    bin_no = models.CharField(max_length=50)
    rack_no = models.CharField(max_length=50)
    qty_available = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.item_part_no} - {self.item_name}"
