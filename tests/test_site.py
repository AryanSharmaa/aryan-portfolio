"""Dependency-free smoke tests for the static portfolio and its deployment inputs."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class PortfolioParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.scripts = []
        self.stylesheets = []
        self.buttons = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag == 'script' and attrs.get('src'):
            self.scripts.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.stylesheets.append(attrs['href'])
        if tag == 'button':
            self.buttons += 1


class PortfolioSiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / 'index.html').read_text(encoding='utf-8')
        cls.css = (ROOT / 'styles.css').read_text(encoding='utf-8')
        cls.js = (ROOT / 'script.js').read_text(encoding='utf-8')
        cls.document = PortfolioParser()
        cls.document.feed(cls.html)

    def test_page_contains_verified_profile_sections(self):
        for required in ('Aryan Sharma', 'Salesforce', 'Monitoring Technical Engineer',
                         'MBA', 'AI in Business', 'Case-response audit', 'CI/CD status-page'):
            with self.subTest(required=required):
                self.assertIn(required.lower(), self.html.lower())

    def test_navigation_targets_exist(self):
        for href in self.document.links:
            if href.startswith('#'):
                with self.subTest(href=href):
                    self.assertIn(href[1:], self.document.ids)

    def test_local_assets_exist(self):
        assets = ['styles.css', 'script.js', 'assets/favicon.svg']
        for asset in assets:
            with self.subTest(asset=asset):
                self.assertTrue((ROOT / asset).is_file())

    def test_interactive_elements_are_wired(self):
        for identifier in ('simulateAlert', 'resetDemo', 'themeToggle',
                           'menuToggle', 'projectDialog'):
            with self.subTest(identifier=identifier):
                self.assertIn(identifier, self.document.ids)
                self.assertIn(identifier, self.js)
        self.assertGreaterEqual(self.document.buttons, 8)

    def test_project_details_and_filters_exist(self):
        for category in ('operations', 'automation', 'learning'):
            with self.subTest(category=category):
                self.assertIn(f'data-filter="{category}"', self.html)
        self.assertEqual(self.html.count('class="project-open"'), 6)
        for project_key in ('audit', 'slack', 'tableau', 'radar', 'cicd', 'aws'):
            self.assertRegex(self.js, rf'\b{project_key}:\s*\{{')

    def test_no_fake_contact_placeholders_or_unfinished_links(self):
        self.assertNotIn('example@email', self.html.lower())
        self.assertNotIn('href="#"', self.html)
        self.assertNotIn('linkedin.com/in/your', self.html.lower())


if __name__ == '__main__':
    unittest.main()
