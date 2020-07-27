import xml.etree.ElementTree as ET
from lxml import html
from html.parser import HTMLParser
import datetime
import sys

links = []
class MyHTMLParser(HTMLParser):

	def handle_starttag(self, tag, attributes):
		if tag == 'a':
			for name, value in attributes:
				if name == 'routerlink':
					links.append(value)

parser = MyHTMLParser()
tree = html.parse('src/app/app.component.html')
parser.feed(html.tostring(tree).decode("utf-8"))
parser.close()

# prune /home since it's a duplicate of base url
links.remove('/home')
base_url = 'https://www.egill.rocks'
missing_links = links.copy()

tree = ET.parse('deploy/sitemap.xml')
root = tree.getroot()
url_el = list(root)
for el in url_el:
	for link in links:
	# assume sub-element 'loc' is the first one in the order
		if el[0].text == base_url + link:
			missing_links.remove(link)

if len(missing_links) > 0:
	print('ERROR: Sitemap.xml does not define these locations:')
	print(missing_links)
	print('base_url: ' + base_url)
	print('Add/change them and then rerun script')
	sys.exit(1)


formatted_date = datetime.datetime.now().strftime("%Y-%m-%d")

print("sitemap.xml is VALID\nCheck if 'priority' and 'changefreq' needs tweaking and change 'lastmod' where applicaple.\nToday is {:s}".format(formatted_date))
print('----------')
