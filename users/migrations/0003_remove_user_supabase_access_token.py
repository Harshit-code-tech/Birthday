# Generated by Django 5.2 on 2025-05-27 15:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_supabase_access_token_alter_user_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='supabase_access_token',
        ),
    ]
