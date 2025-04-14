summary_jobs = {}

def create_job(job_id: str):
    summary_jobs[job_id] = {"status": "processing", "summary": None}

def update_job(job_id: str, summary: str, error: str = None):
    summary_jobs[job_id] = {
        "status": "done",
        "summary": summary,
        "error": error
    }

def get_job_status(job_id: str):
    return summary_jobs.get(job_id, {"status": "not_found"})
