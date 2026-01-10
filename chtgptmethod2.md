🟢 المستوى 1: Google Search + Parsing (أسهل)
الفكرة

تبعت Query لجوجل

تجيب أول نتيجة من sephora.com

تحفظ اللينك

مثال (Python – تعليمي):
import requests
from bs4 import BeautifulSoup

query = "Dior Sauvage 100ml site:sephora.com"
url = f"https://www.google.com/search?q={query.replace(' ', '+')}"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

for link in soup.select("a"):
    href = link.get("href")
    if href and "sephora.com" in href:
        print(href)
        break


⚠️ ملحوظة مهمة
Google مش بيحب scraping → ده للتجربة فقط.

🟡 المستوى 2: Scraping مباشر من Sephora (أفضل)
الفكرة

تدخل على Sephora Search Page

تبحث باسم المنتج

تطلع أول Result URL

مثال:
import requests
from bs4 import BeautifulSoup

search_url = "https://www.sephora.com/search?keyword=dior%20sauvage"

headers = {
    "User-Agent": "Mozilla/5.0"
}

res = requests.get(search_url, headers=headers)
soup = BeautifulSoup(res.text, "html.parser")

product = soup.select_one("a[data-at='sku_item_link']")
print("https://www.sephora.com" + product['href'])


✔️ ده أقرب للي بيحصل فعليًا

🔴 المستوى 3: الطريقة الاحترافية (زي الشركات)
تستخدم:

SerpAPI (Google Search API)

أو RapidAPI – Product Search

أو Sephora unofficial APIs (Network tab)

مثال باستخدام SerpAPI:
from serpapi import GoogleSearch

params = {
  "engine": "google",
  "q": "Dior Sauvage 100ml Sephora",
  "api_key": "YOUR_API_KEY"
}

search = GoogleSearch(params)
results = search.get_dict()

for r in results["organic_results"]:
    if "sephora.com" in r["link"]:
        print(r["link"])
        break


✔️ ده:

قانوني

ثابت

سريع

ينفع Production

⚠️ حاجات لازم تخلي بالك منها

Sephora بتغيّر HTML أحيانًا

لازم User-Agent

Cache النتائج

متضربش Requests كتير