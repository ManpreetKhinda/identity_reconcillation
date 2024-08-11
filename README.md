
# Identity-Reconcillation


This is an API testing application made for the purpose of merging account having any of crucial detials common either be email or phone number.

## Deployment

This project has been deployed at

```bash
    https://identity-reconcillation.onrender.com/api/identify
```

To test the API we can use postman or any other tool for the test the endpoint requires a json request in the form of

```bash
{
    "email": "delight@hillvalley.edu",
    "phoneNumber": "9097021338"
}
```
and return a json response as per the provided logic for this input if entered as first post request the response would be 

```bash
{
    "contact": {
        "primaryContactId": 6,
        "emails": [
            "delight@hillvalley.edu"
        ],
        "phoneNumbers": [
            "9097021338"
        ],
        "secondaryContactIds": []
    }
}
```
