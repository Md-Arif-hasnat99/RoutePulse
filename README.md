# RoutePulse (Hackathon MVP)

RoutePulse is a minimal real-time logistics monitoring MVP.

Architecture:

Simulator -> Risk Engine -> Routing Engine -> AI Explainer -> API -> Frontend

## Project Structure

backend/

- app/main.py
- app/models.py
- app/routes/
- app/services/simulator.py
- app/services/risk_engine.py
- app/services/routing.py
- app/services/ai_explainer.py
- app/services/store.py
- tests/

frontend/

- src/components/
- src/pages/

## Run Instructions

### 1) Backend

From project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Set Gemini API key (optional, fallback works without it):

```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

Start backend:

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

### 2) Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Hosting on Local Network
To access RoutePulse from another device (like a phone) on the same Wi-Fi:
1. Find your PC's IP address: Run `ipconfig` in PowerShell and look for `IPv4 Address` (e.g., `192.168.1.5`).
2. Run the frontend: `npm run dev` (now updated with `--host`).
3. Run the backend with network access:
   ```powershell
   cd backend
   ..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0
   ```
4. On your mobile device, navigate to `http://<your-ip>:5173`.

Note: frontend dev server proxies /api requests to http://127.0.0.1:8000.

## Phase-by-Phase Manual Test Step

### Phase 1: Basic Backend

1. Check health.

```powershell
curl http://localhost:8000/health
```

Expected:

```json
{"status":"ok"}
```

1. Get shipments.

```powershell
curl http://localhost:8000/shipments
```

Expected: list with 3 seeded shipments (S-001, S-002, S-003).

1. Get one shipment.

```powershell
curl http://localhost:8000/shipments/S-001
```

1. Create shipment.

```powershell
curl -X POST http://localhost:8000/shipments -H "Content-Type: application/json" -d '{"id":"S-900","current_location":[40.0,-73.9],"speed":52,"route":["A","D"],"eta":90}'
```

### Phase 2: Simulator

1. Call shipments repeatedly every few seconds.

```powershell
curl http://localhost:8000/shipments
```

1. Confirm speed and location values change over time.
1. Confirm API remains responsive while updates run.

### Phase 3: Risk Engine

1. Check risk endpoint.

```powershell
curl http://localhost:8000/risk/S-001
```

1. Validate logic.

- speed < 20 => HIGH
- speed < 40 => MEDIUM
- else => LOW

### Phase 4: Routing Engine

1. Request reroute.

```powershell
curl http://localhost:8000/reroute/S-001
```

1. Confirm a shortest path over graph nodes A/B/C/D is returned.

### Phase 5: Integration (Risk + Reroute)

1. Wait until a shipment becomes HIGH risk.
1. Fetch shipment details.

```powershell
curl http://localhost:8000/shipments/S-001
```

1. Confirm suggested_route appears for HIGH risk shipments.

### Phase 6: Gemini Explanation

1. Call risk endpoint.

```powershell
curl http://localhost:8000/risk/S-001
```

1. Confirm response contains risk and explanation.
1. Fallback test.

- Unset GEMINI_API_KEY and restart backend.
- Call /risk/S-001.
- Confirm fallback explanation still returns.

### Phase 7: Frontend Dashboard

1. Open [http://localhost:5173](http://localhost:5173).
1. Confirm left panel shows shipment cards (ID, speed, color risk).
1. Click a shipment and confirm right panel shows route, ETA, suggested route, and AI explanation.
1. Wait 3 seconds and confirm live updates without browser reload.

## Unit Tests

From backend folder:

```powershell
..\.venv\Scripts\python.exe -m pytest tests -q
```

Covered:

- risk engine rules
- routing shortest path

## Final Checklist

- [ ] Shipments update in real time
- [ ] Risk changes dynamically
- [ ] Reroute appears for HIGH risk
- [ ] Gemini explanation appears
- [ ] Fallback explanation works if Gemini fails
- [ ] Frontend updates every 3 seconds without page reload

## Hackathon Demo Steps (5-7 min)

1. Start backend and frontend.
1. Show live shipment list and auto-refresh behavior.
1. Click a shipment and explain risk monitoring.
1. Wait for a HIGH-risk event and show suggested reroute.
1. Show AI explanation text for operations context.
1. Unset GEMINI_API_KEY and show fallback explanation still works.
1. Run tests quickly to prove core logic reliability.
