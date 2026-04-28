# RoutePulse 🚚

RoutePulse is a real-time logistics monitoring and routing MVP that leverages AI to explain risk factors and reroute shipments dynamically.

## 🚀 Features

- **Real-Time Logistics Monitoring**: Monitor active shipments across different stages, routes, and operational statuses.
- **Secure Authentication**: Robust, role-based access management powered by Clerk.
- **Automated Risk Engine**: Automatically assess logistical risks based on factors like weather, traffic patterns, and vehicle issues.
- **Dynamic Rerouting**: Generate alternative paths dynamically when original routes become too risky or blocked.
- **AI-Powered Explainability**: Understand risk factors and routing decisions via an integrated natural language AI explainer.

## 📁 Project Structure

```text
RoutePulse/
├── backend/                  # FastAPI & Python backend
│   ├── app/
│   │   ├── main.py           # Application entry point
│   │   ├── models.py         # Pydantic data models
│   │   ├── routes/           # API Endpoints (reroute, risk, shipments)
│   │   └── services/         # Core business logic (AI, Risk, Routing, Simulator)
│   ├── tests/                # Pytest suites
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI React components (Cards, Layouts)
│   │   ├── pages/            # Page-level components (Dashboard, Shipments...)
│   │   ├── utils/            # API and utility functions
│   │   ├── App.jsx           # Main React App routing & protected routes
│   │   └── main.jsx          # React DOM mounting
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

## 🛠️ Run Instructions

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

Note: The frontend dev server proxies `/api` requests to `http://127.0.0.1:8000`.

## 🔮 Upcoming Features

- 📱 **Mobile Application**: Native mobile app for drivers to update statuses on the go.
- 🔔 **Automated Alerts (SMS/Email)**: Notify stakeholders instantly when severe delays or risks are detected via Twilio/SendGrid.
- 🏢 **Multi-Tenant Support**: Expanded capability for multiple logistics companies managing their own separate fleets.
- 🌍 **Live GPS Integrations**: Real-time integration with physical IoT/GPS devices on fleet vehicles.
- 📊 **Advanced Analytics Dashboard**: Historical trends reporting and predictive maintenance insights.

## 📄 License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 Md Arif Hasnat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

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
