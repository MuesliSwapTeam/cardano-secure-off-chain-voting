# Generated by Django 2.2.24 on 2023-03-20 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('helios', '0006_votersnapshot'),
    ]

    operations = [
        migrations.AddField(
            model_name='votersnapshot',
            name='pkh',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='votersnapshot',
            name='skh',
            field=models.CharField(max_length=100, null=True),
        ),
    ]