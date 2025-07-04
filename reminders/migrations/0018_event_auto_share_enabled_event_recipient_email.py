# Generated by Django 5.2 on 2025-06-24 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reminders', '0017_eventmedia_mime_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='auto_share_enabled',
            field=models.BooleanField(default=True, help_text='Automatically share card with recipient on event date.'),
        ),
        migrations.AddField(
            model_name='event',
            name='recipient_email',
            field=models.EmailField(blank=True, help_text='Email address of the card recipient.', max_length=254, null=True),
        ),
    ]
