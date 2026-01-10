Complete Perfume Affiliate Aggregation Platform
┌─────────────────────────────────────────────────────────┐
│                     USER REQUEST                         │
│   "Chanel Coco Mademoiselle Eau de Parfum 100ml"       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              PRODUCT NORMALIZER                          │
│  Extract: brand, line, concentration, size               │
│  Generate: normalized_id (unique hash)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           RETAILER AGGREGATOR (Parallel)                 │
│  ├─ Sephora Adapter                                     │
│  ├─ Shoppers Drug Mart Adapter                          │
│  ├─ Holt Renfrew Adapter                                │
│  ├─ Amazon Canada Adapter                               │
│  └─ Chanel Official Adapter                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              VALIDATION ENGINE                           │
│  Match: brand, line, concentration, size                 │
│  Calculate: confidence score (0-100)                     │
│  Filter: Accept only 80+ confidence                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           AFFILIATE LINK INJECTOR                        │
│  Add tracking params per retailer                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              UNIFIED API RESPONSE                        │
│  [{retailer, price, url, confidence, delivery}]          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                FRONTEND DISPLAY                          │
│  Sorted retailer cards with "Visit" CTAs                 │
┌─────────────────────────────────────────────────────────┐