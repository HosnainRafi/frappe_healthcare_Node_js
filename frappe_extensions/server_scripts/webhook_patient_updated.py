"""
Server Script: Webhook - Patient Updated
Type: DocType Event
DocType: Patient
Event: After Save

Send webhook notification to Node.js when patient record is updated
"""

import frappe
import requests
import json
from frappe.utils import now
import hmac
import hashlib

def execute(doc, method):
    """Send webhook to Node.js when patient is created/updated"""
    
    # Get Node.js webhook URL from site config
    webhook_url = frappe.conf.get('nodejs_webhook_url', 'http://nodejs-backend:3000/webhook/patient-updated')
    webhook_secret = frappe.conf.get('webhook_secret', 'webhook-secret-change-this-in-production')
    
    # Prepare payload
    payload = {
        "event": "patient_updated",
        "doctype": "Patient",
        "doc_name": doc.name,
        "data": {
            "name": doc.name,
            "patient_name": doc.patient_name,
            "first_name": doc.first_name,
            "last_name": doc.last_name,
            "email": doc.email,
            "mobile": doc.mobile,
            "sex": doc.sex,
            "dob": str(doc.dob) if doc.dob else None,
            "blood_group": doc.blood_group,
            "status": doc.status
        },
        "timestamp": now()
    }
    
    # Send webhook asynchronously
    frappe.enqueue(
        send_webhook,
        queue='short',
        url=webhook_url,
        payload=payload,
        secret=webhook_secret
    )

def send_webhook(url, payload, secret):
    """Send HTTP POST to Node.js webhook endpoint"""
    try:
        # Generate HMAC signature
        signature = hmac.new(
            secret.encode(),
            json.dumps(payload).encode(),
            hashlib.sha256
        ).hexdigest()
        
        headers = {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        
        if response.status_code != 200:
            frappe.log_error(
                f"Webhook failed: {response.text}",
                "Node.js Webhook Error"
            )
    except Exception as e:
        frappe.log_error(str(e), "Node.js Webhook Exception")
