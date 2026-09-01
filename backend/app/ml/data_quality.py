from typing import Dict, Any, Tuple

class DataQualityValidator:
    """
    Validates urban telemetry records against physical and operational bounds.
    """
    
    BOUNDS = {
        "aqi": (0, 500),
        "pm25": (0.0, 999.0),
        "pm10": (0.0, 999.0),
        "co2_ppm": (0.0, 5000.0),
        "temperature_c": (-50.0, 60.0),
        "humidity_pct": (0.0, 100.0),
        "traffic_density": (0, 1000),
        "congestion_index": (0.0, 1.0),
        "avg_speed_kmh": (0.0, 150.0)
    }

    @classmethod
    def validate_record(cls, record: Dict[str, Any]) -> Tuple[bool, list]:
        """
        Checks a telemetry payload against acceptable operational bounds.
        Returns (is_valid, list_of_violations).
        """
        violations = []
        
        for key, (min_val, max_val) in cls.BOUNDS.items():
            if key in record and record[key] is not None:
                val = record[key]
                try:
                    num_val = float(val)
                    if num_val < min_val or num_val > max_val:
                        violations.append(f"{key} value {num_val} outside valid range [{min_val}, {max_val}]")
                except (ValueError, TypeError):
                    violations.append(f"{key} contains non-numeric value: {val}")
                    
        return (len(violations) == 0, violations)

    @classmethod
    def evaluate_dataset_health(cls, records: list) -> Dict[str, Any]:
        """
        Evaluates an entire dataset list of records for overall quality status.
        """
        if not records:
            return {"status": "DATA QUALITY ● NO TELEMETRY", "health_score": 0.0, "invalid_count": 0}
            
        invalid_count = 0
        total_count = len(records)
        
        for rec in records:
            rec_dict = rec.__dict__ if hasattr(rec, '__dict__') else rec
            is_valid, _ = cls.validate_record(rec_dict)
            if not is_valid:
                invalid_count += 1
                
        valid_pct = round(((total_count - invalid_count) / total_count) * 100, 1)
        
        if valid_pct >= 98.0:
            status_text = "DATA QUALITY ● GOOD"
        elif valid_pct >= 90.0:
            status_text = "DATA QUALITY ⚠ DEGRADED"
        else:
            status_text = "DATA QUALITY 🔴 POOR"
            
        return {
            "status": status_text,
            "valid_percent": valid_pct,
            "total_records": total_count,
            "invalid_count": invalid_count
        }

data_quality_validator = DataQualityValidator()
