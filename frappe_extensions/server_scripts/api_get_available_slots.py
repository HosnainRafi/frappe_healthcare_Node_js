"""
Server Script: API - Get Available Slots
Type: API
API Method: hospital.get_available_slots
Allow Guest: No

This script provides available time slots for a doctor on a specific date
"""

import frappe
from datetime import datetime, timedelta
import json

@frappe.whitelist()
def execute(practitioner, date):
    """
    Get available time slots for a doctor on a specific date
    
    Args:
        practitioner: Healthcare Practitioner ID
        date: Date in YYYY-MM-DD format
    
    Returns:
        List of available slots with timing
    """
    
    try:
        # Convert date string to datetime
        appointment_date = datetime.strptime(date, '%Y-%m-%d').date()
        
        # Get practitioner schedule
        schedule_info = frappe.db.get_value(
            'Healthcare Practitioner',
            practitioner,
            ['practitioner_schedule', 'appointment_duration'],
            as_dict=True
        )
        
        if not schedule_info or not schedule_info.get('practitioner_schedule'):
            return {
                'success': False,
                'error': 'No schedule found for practitioner',
                'slots': []
            }
        
        # Get schedule details
        schedule_doc = frappe.get_doc('Practitioner Schedule', schedule_info['practitioner_schedule'])
        duration = schedule_info.get('appointment_duration') or 15  # Default 15 minutes
        
        # Find schedule for the day of week
        day_of_week = appointment_date.strftime('%A')
        schedule_slot = None
        
        for time_slot in schedule_doc.time_slots:
            if time_slot.day == day_of_week:
                schedule_slot = time_slot
                break
        
        if not schedule_slot:
            return {
                'success': True,
                'slots': [],
                'message': 'Doctor not available on this day'
            }
        
        # Get existing appointments
        existing_appointments = frappe.get_all(
            'Patient Appointment',
            filters={
                'practitioner': practitioner,
                'appointment_date': date,
                'status': ['not in', ['Cancelled']]
            },
            fields=['appointment_time', 'duration']
        )
        
        # Generate time slots
        from_time = datetime.combine(appointment_date, schedule_slot.from_time)
        to_time = datetime.combine(appointment_date, schedule_slot.to_time)
        
        slots = []
        current_time = from_time
        
        while current_time < to_time:
            slot_time = current_time.time()
            
            # Check if slot is already booked
            is_available = True
            for apt in existing_appointments:
                apt_time = apt['appointment_time']
                if isinstance(apt_time, str):
                    apt_time = datetime.strptime(apt_time, '%H:%M:%S').time()
                
                if apt_time == slot_time:
                    is_available = False
                    break
            
            slots.append({
                'time': slot_time.strftime('%H:%M'),
                'full_datetime': current_time.isoformat(),
                'available': is_available,
                'duration': duration
            })
            
            current_time += timedelta(minutes=duration)
        
        return {
            'success': True,
            'date': date,
            'practitioner': practitioner,
            'slots': slots,
            'total_slots': len(slots),
            'available_slots': len([s for s in slots if s['available']])
        }
        
    except Exception as e:
        frappe.log_error(str(e), "Get Available Slots Error")
        return {
            'success': False,
            'error': str(e),
            'slots': []
        }
