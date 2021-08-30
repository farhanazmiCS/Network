from django.views.generic import ListView
from models import Post

class PostAsListView(ListView):
    paginate_by = 2
    model = Post