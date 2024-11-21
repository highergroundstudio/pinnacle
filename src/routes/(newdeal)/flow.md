# New Deal Flow

## Objective
The objective of this flow is to create a new deal in the system.

## Flow from user perspective
1. The user enters the new deal page.
2. The user enters the deal information.
3. The user clicks on the "Create" button.
4. Shows progress indicator.
5. Redirected the user to the deal page on success.
6. Shows error message on failure on same page.

## Flow from system perspective
1. receives the request to create a new deal.
2. Validates the deal information.
3. Creates the deal on hubspot via the hubspot api.
4. Associates the deal with the broker on hubspot via the hubspot api.
5. Creates the folder on the server using the folder api.
6. If successful, redirects the user to the deal page and displays folder url and deal url on hubspot.
7. If unsuccessful, shows error message on new deal page

```
 POST {
  valid: true,
  errors: {},
  data: {
    dealname: 'Buy More Test Deal',
    dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
    transaction_type_raw: [ 'Cashout', 'Construction', 'Bridge', 'Rehab/Construction' ],
    transaction_type: 'Cashout; Construction; Bridge; Rehab/Construction',
    property_type_raw: [
      'Industrial',
      'Mixed-use',
      'Mobile Home Park',
      'Hospitality',
      '1-4 Unit Residential Rental'
    ],
    property_type: 'Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental',
    property_type_future_raw: [
      'Retail',
      'Self Storage',
      '1-4 Unit Residential Rental',
      'Assisted Living',
      'Office',
      'Agricultural',
      'Other'
    ],
    property_type_future: 'Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other',
    amount: 10000000,
    amount_input: '10,000,000',
    as_is_value: 20000000,
    as_is_value_input: '20,000,000',
    address: '9000 Burbank Boulevard',
    city: 'Burbank',
    state: 'California',
    zip_code: '91506',
    email: 'kyle.king@elevatedequities.com',
    firstname: 'Kyle',
    lastname: 'King',
    broker_id: '7451'
  },
  empty: false,
  constraints: {
    dealname: { minlength: 2 },
    dealstage: { minlength: 2 },
    address: { minlength: 2 },
    city: { minlength: 2 },
    state: { minlength: 2 },
    zip_code: { pattern: '^\\d{5}$' },
    firstname: { minlength: 2 },
    lastname: { minlength: 2 },
    broker_id: { minlength: 2 }
  }
}
```

# The success message on the success page
```
{
    "flash": {
        "type": "success",
        "message": "Hey, you got a deal!",
        "data": {
            "dealResponse": {
                "success": true,
                "dealResponse": {
                    "success": true,
                    "message": "Deal Created",
                    "id": 13071595521
                },
                "brokerInfo": {
                    "firstname": "Kyle",
                    "lastname": "King",
                    "fullname": "Kyle King",
                    "id": "7451"
                },
                "formData": {
                    "dealname": "Buy More Test Deal Burbank CA",
                    "dealstage": "62553446",
                    "transaction_type_raw": [
                        "Cashout",
                        "Construction",
                        "Bridge",
                        "Rehab/Construction"
                    ],
                    "transaction_type": "Cashout; Construction; Bridge; Rehab/Construction",
                    "property_type_raw": [
                        "Industrial",
                        "Mixed-use",
                        "Mobile Home Park",
                        "Hospitality",
                        "1-4 Unit Residential Rental"
                    ],
                    "property_type": "Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
                    "property_type_future_raw": [
                        "Retail",
                        "Self Storage",
                        "1-4 Unit Residential Rental",
                        "Assisted Living",
                        "Office",
                        "Agricultural",
                        "Other"
                    ],
                    "property_type_future": "Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
                    "amount": 10000000,
                    "amount_input": "10,000,000",
                    "as_is_value": 20000000,
                    "as_is_value_input": "20,000,000",
                    "address": "9000 Burbank Boulevard",
                    "city": "Burbank",
                    "state": "California",
                    "zip_code": "91506",
                    "email": "kyle.king@elevatedequities.com",
                    "firstname": "Kyle",
                    "lastname": "King",
                    "broker_id": "7451"
                }
            }
        }
    }
}
```