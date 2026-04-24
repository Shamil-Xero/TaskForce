import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health(client):
    res = client.get('/health')
    assert res.status_code == 200

def test_get_tasks_empty(client):
    res = client.get('/tasks')
    assert res.status_code == 200

def test_create_task(client):
    res = client.post('/tasks',
        data=json.dumps({"title": "Test Task"}),
        content_type='application/json')
    assert res.status_code == 201
    assert b"Test Task" in res.data

def test_create_task_no_title(client):
    res = client.post('/tasks',
        data=json.dumps({}),
        content_type='application/json')
    assert res.status_code == 400

def test_get_nonexistent_task(client):
    res = client.get('/tasks/999')
    assert res.status_code == 404
