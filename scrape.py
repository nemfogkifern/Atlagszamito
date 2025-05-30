import requests
from bs4 import BeautifulSoup
import time
import csv

base_url = "https://www.uni-corvinus.hu/fooldal/kepzes/tantargyak/page/{}/?sort=rel&semester%5B0%5D=2024-25-2&semester%5B1%5D=2024-25-1&semester%5B2%5D=2023-24-2&semester%5B3%5D=2023-24-1&credit%5B0%5D=1&credit%5B1%5D=10&s="

results = []

for page in range(1, 163):
    print(f"Scraping page {page}...")
    url = base_url.format(page)
    response = requests.get(url)
    response.encoding = 'utf-8'  # Biztos, hogy utf-8 a kódolás

    if response.status_code != 200:
        print(f"Error fetching page {page}")
        continue

    soup = BeautifulSoup(response.text, 'html.parser')

    targy_nevek = soup.select('h4.res-title')
    kredit_ertekek = soup.select('div:nth-of-type(3) strong')
    felelosok = soup.select('span.cor-link')
    nyelvek = soup.select('div.res-detail:nth-of-type(4) strong')
    linkek = soup.select('a.res-item')

    # Ellenőrizzük, hogy mindegyik listának ugyanannyi eleme van-e
    count = min(len(targy_nevek), len(kredit_ertekek), len(felelosok), len(nyelvek), len(linkek))

    for i in range(count):
        try:
            results.append({
                'targy_nev': targy_nevek[i].get_text(strip=True),
                'kredit': kredit_ertekek[i].get_text(strip=True),
                'felelos': felelosok[i].get_text(strip=True),
                'nyelv': nyelvek[i].get_text(strip=True),
                'link': linkek[i]['href'],
            })
        except Exception as e:
            print(f"Hiba az adatfeldolgozásnál index {i}: {e}")

    time.sleep(1)  # Ne terheljük túl a szervert

# Eredmények mentése CSV fájlba UTF-8 kódolással
with open('tantargyak.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['targy_nev', 'kredit', 'felelos', 'nyelv', 'link'])
    writer.writeheader()
    writer.writerows(results)

print("Scraping kész!")
