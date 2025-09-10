import requests
import mysql.connector
from mysql.connector import Error
from datetime import datetime

# -----------------------------
# Configuration API et BDD
# -----------------------------
API_KEY = "046cfad9b02aae2e067dd1a9fd4e4492"
API_BASE = "https://api.jeb-incubator.com"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "azerty",
    "database": "survivor"
}

HEADERS = {"X-Group-Authorization": API_KEY}

# -----------------------------
# Utilitaires
# -----------------------------
def get_api(endpoint):
    url = f"{API_BASE}{endpoint}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

def parse_datetime(dt_str):
    if not dt_str:
        return datetime.now()
    try:
        return datetime.fromisoformat(dt_str.replace("Z", ""))
    except ValueError:
        return datetime.now()

# -----------------------------
# Fonctions d’insertion
# -----------------------------
def insert_user(cursor, user):
    query = """
        INSERT IGNORE INTO users (id, email, password, name, role, founder_id, investor_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        user.get("id"),
        user.get("email"),
        user.get("password") or "azerty",
        user.get("name") or "",
        user.get("role") or "client",
        user.get("founder_id"),
        user.get("investor_id"),
    ))

def insert_startup(cursor, startup):
    query = """
        INSERT IGNORE INTO startups (id, name, legal_status, address, email, phone, created_at,
        description, website_url, social_media_url, project_status, needs, sector, maturity,
        image, views)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    created_at = parse_datetime(startup.get("created_at"))
    cursor.execute(query, (
        startup.get("id"),
        startup.get("name") or startup.get("names") or "",
        startup.get("legal_status") or "",
        startup.get("address") or "",
        startup.get("email") or "",
        startup.get("phone") or "",
        created_at,
        startup.get("description") or "",
        startup.get("website_url") or "",
        startup.get("social_media_url") or "",
        startup.get("project_status") or "Not started",
        startup.get("needs") or "",
        startup.get("sector") or "",
        startup.get("maturity") or "",
        startup.get("image") or "",
        startup.get("views") or 0
    ))

def insert_founder(cursor, founder):
    query = """
        INSERT IGNORE INTO founders (id, name, startup_id)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (
        founder.get("id"),
        founder.get("name") or "",
        founder.get("startup_id")
    ))

def insert_news(cursor, news):
    query = """
        INSERT IGNORE INTO news (id, startup_id, news_date, location, title, category, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    news_date = parse_datetime(news.get("news_date"))
    cursor.execute(query, (
        news.get("id"),
        news.get("startup_id"),
        news_date,
        news.get("location") or "",
        news.get("title") or "",
        news.get("category") or "",
        news.get("description") or ""
    ))

def insert_investor(cursor, investor):
    query = """
        INSERT IGNORE INTO investors (id, name, legal_status, address, email, phone, created_at, description, investor_type, investment_focus)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    created_at = parse_datetime(investor.get("created_at"))
    cursor.execute(query, (
        investor.get("id"),
        investor.get("name") or investor.get("names") or "",
        investor.get("legal_status") or "",
        investor.get("address") or "",
        investor.get("email") or "",
        investor.get("phone") or "",
        created_at,
        investor.get("description") or "",
        investor.get("investor_type") or "",
        investor.get("investment_focus") or ""
    ))

def insert_partner(cursor, partner):
    query = """
        INSERT IGNORE INTO partners (id, name, legal_status, address, email, phone, created_at, description, partnership_type)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    created_at = parse_datetime(partner.get("created_at"))
    cursor.execute(query, (
        partner.get("id"),
        partner.get("name") or partner.get("names") or "",
        partner.get("legal_status") or "",
        partner.get("address") or "",
        partner.get("email") or "",
        partner.get("phone") or "",
        created_at,
        partner.get("description") or "",
        partner.get("partnership_type") or ""
    ))

def insert_event(cursor, event):
    query = """
        INSERT IGNORE INTO events (id, name, dates, location, description, event_type, target_audience)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    dates = parse_datetime(event.get("dates"))
    cursor.execute(query, (
        event.get("id"),
        event.get("name") or "",
        dates,
        event.get("location") or "",
        event.get("description") or "",
        event.get("event_type") or "",
        event.get("target_audience") or ""
    ))

# -----------------------------
# Main script
# -----------------------------
def main():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Users
        users = get_api("/users")
        for u in users:
            insert_user(cursor, u)
        conn.commit()
        print(f"{len(users)} users insérés.")

        # Startups
        startups = get_api("/startups")
        for s in startups:
            insert_startup(cursor, s)
            for f in s.get("founders", []):
                insert_founder(cursor, f)
        conn.commit()
        print(f"{len(startups)} startups insérées avec fondateurs.")

        # Investors
        investors = get_api("/investors")
        for inv in investors:
            insert_investor(cursor, inv)
        conn.commit()
        print(f"{len(investors)} investisseurs insérés.")

        # Partners
        partners = get_api("/partners")
        for p in partners:
            insert_partner(cursor, p)
        conn.commit()
        print(f"{len(partners)} partenaires insérés.")

        # News
        news_list = get_api("/news")
        for n in news_list:
            insert_news(cursor, n)
        conn.commit()
        print(f"{len(news_list)} news insérées.")

        # Events
        events = get_api("/events")
        for e in events:
            insert_event(cursor, e)
        conn.commit()
        print(f"{len(events)} événements insérés.")

    except Error as e:
        print("Erreur BDD:", e)
    except requests.HTTPError as e:
        print("Erreur API:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Connexion à la BDD fermée.")

if __name__ == "__main__":
    main()
