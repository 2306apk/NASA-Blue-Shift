from unittest.mock import patch
from django.test import TestCase, Client
from django.urls import reverse
from .models import Dataset, Annotation, ImageMetadata, NASASearchResult, SearchQuery


class APIRootTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('endpoints', data)
        self.assertIn('message', data)


class NASASearchTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_search_missing_query(self):
        response = self.client.get('/api/search/nasa/')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_search_too_short_query(self):
        response = self.client.get('/api/search/nasa/?q=x')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_search_from_cached_db(self):
        # Create a search result in the database
        NASASearchResult.objects.create(
            nasa_id='test-saturn-001',
            title='Saturn Cassini Rings',
            description='Spectacular view of Saturn rings',
            keywords=['saturn', 'cassini', 'rings'],
            image_url='https://images-assets.nasa.gov/image/saturn.jpg',
            thumbnail_url='https://images-assets.nasa.gov/image/saturn_thumb.jpg',
            center='JPL',
            search_query='saturn',
        )

        response = self.client.get('/api/search/nasa/?q=saturn')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['query'], 'saturn')
        self.assertGreaterEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['nasa_id'], 'test-saturn-001')

    @patch('api.nasa_services.NASAImageSearchService.fetch_from_nasa')
    def test_search_external_fetch(self, mock_fetch):
        mock_fetch.return_value = [
            {
                'nasa_id': 'mock-neptune-1',
                'title': 'Neptune Voyager',
                'description': 'Voyager 2 passes Neptune',
                'keywords': ['neptune'],
                'image_url': 'https://example.com/neptune.jpg',
                'thumbnail_url': 'https://example.com/neptune_thumb.jpg',
                'center': 'JPL',
                'date_created': None,
                'media_type': 'image',
            }
        ]

        response = self.client.get('/api/search/nasa/?q=neptune')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['nasa_id'], 'mock-neptune-1')


class NASADetailsAndPopularTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_image_details_existing(self):
        NASASearchResult.objects.create(
            nasa_id='jupiter-juno-99',
            title='Jupiter Great Red Spot',
            description='Juno spacecraft image of Jupiter',
            keywords=['jupiter', 'juno'],
            image_url='https://example.com/jupiter.jpg',
            thumbnail_url='https://example.com/jupiter_thumb.jpg',
            center='JPL',
            search_query='jupiter',
        )
        response = self.client.get('/api/nasa/image/jupiter-juno-99/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], 'Jupiter Great Red Spot')
        self.assertEqual(data['nasa_id'], 'jupiter-juno-99')

    def test_image_details_404(self):
        response = self.client.get('/api/nasa/image/non-existent-id/')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_popular_searches(self):
        SearchQuery.objects.create(query='mars', search_count=10)
        SearchQuery.objects.create(query='jupiter', search_count=5)

        response = self.client.get('/api/search/popular/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('popular_searches', data)
        self.assertEqual(len(data['popular_searches']), 2)
        self.assertEqual(data['popular_searches'][0]['query'], 'mars')


class DatasetAndAnnotationTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.dataset = Dataset.objects.create(
            slug='mars-surface',
            title='Mars Surface MRO',
            description='High resolution imaging from MRO',
            source_mission='Mars Reconnaissance Orbiter',
        )

    def test_dataset_list_and_info(self):
        response = self.client.get('/api/datasets/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 1)

        response_info = self.client.get('/api/datasets/mars-surface/info/')
        self.assertEqual(response_info.status_code, 200)
        self.assertEqual(response_info.json()['slug'], 'mars-surface')

    def test_annotation_crud_and_search(self):
        # Create annotation
        post_response = self.client.post('/api/annotations/', {
            'dataset': self.dataset.id,
            'feature_name': 'Gale Crater',
            'x': 120.5,
            'y': 45.2,
            'zoom': 3,
            'note': 'Landing site of Curiosity rover',
        }, content_type='application/json')
        self.assertEqual(post_response.status_code, 201)
        annotation_id = post_response.json()['id']

        # List annotations filtered by dataset slug
        list_response = self.client.get('/api/annotations/?dataset=mars-surface')
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()['results']), 1)

        # Search features
        search_res = self.client.get('/api/search/?q=crater')
        self.assertEqual(search_res.status_code, 200)
        self.assertGreaterEqual(len(search_res.json()['results']), 1)

        # Delete annotation
        del_res = self.client.delete(f'/api/annotations/{annotation_id}/')
        self.assertEqual(del_res.status_code, 204)


class APODAndTilesTests(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('api.nasa_services.NASADataFetcher.fetch_apod')
    def test_nasa_apod_success(self, mock_fetch):
        mock_fetch.return_value = {
            'title': 'The Pillars of Creation',
            'url': 'https://example.com/pillars.jpg',
            'explanation': 'Interstellar gas and dust in the Eagle Nebula',
            'date': '2026-11-11',
            'media_type': 'image',
        }
        response = self.client.get('/api/nasa/apod/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['title'], 'The Pillars of Creation')

    @patch('api.nasa_services.NASADataFetcher.fetch_apod')
    def test_nasa_apod_failure(self, mock_fetch):
        mock_fetch.return_value = None
        response = self.client.get('/api/nasa/apod/')
        self.assertEqual(response.status_code, 502)
        self.assertIn('error', response.json())

    def test_missing_tile_returns_404(self):
        response = self.client.get('/tiles/earth/0/0/0.png')
        self.assertEqual(response.status_code, 404)
