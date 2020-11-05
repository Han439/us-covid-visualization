from django.test import SimpleTestCase
from django.urls import reverse, resolve

from .. import views


# Create your tests here.


class TestUrlsNameResolve(SimpleTestCase):

    def test_index_url_resolve(self):
        url = reverse('index')
        self.assertEqual(resolve(url).func, views.index)

    def test_create_poll_url_resolve(self):
        url = reverse('map-api')
        self.assertEqual(resolve(url).func.view_class, views.MapAPI)

    def test_poll_detail_url_resolve(self):
        url = reverse('grow-rate')
        self.assertEqual(resolve(url).func.view_class, views.GrowRate)

    def test_profile_url_resolve(self):
        url = reverse('death-rate')
        self.assertEqual(resolve(url).func.view_class, views.DeathRate)
