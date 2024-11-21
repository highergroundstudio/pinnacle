export const dealStageOptions = [
	{
		value: {
			name: "test",
			hubspot: "62553446",
			folder: "test",
		},
		label: "Test",
		selected: false,
	},
	{
		value: {
			name: "presubmission",
			hubspot: "0ddfafd1-56a8-4879-aa59-97d52793d8b0",
			folder: "0 Pre-Submission - Holding for Rest of Package",
		},
		label: "Pre-Submission",
		selected: false,
	},
	{
		value: {
			name: "newsubmission",
			hubspot: "appointmentscheduled",
			folder: "1 New Submission To Review",
		},
		label: "New Submission",
		selected: true,
	},
	{
		value: {
			name: "secondreview",
			hubspot: "presentationscheduled",
			folder: "2 Second Review",
		},
		label: "Second Review",
		selected: false,
	},
	{
		value: {
			name: "committeepricing",
			hubspot: "contractsent",
			folder: "4 Reviewed - In Committee for Pricing",
		},
		label: "In committee for pricing",
		selected: false,
	},
	{
		value: {
			name: "termsissued",
			hubspot: "4df75d47-6414-4729-8c0c-2340c07cf6b8",
			folder: "5 OA or Terms Issued",
		},
		label: "OA or terms issued",
		selected: false,
	},
	{
		value: {
			name: "engaged",
			hubspot: "ce0c9853-6045-4a37-a8d9-604985dfdaa3",
			folder: "6 Engaged - In Process",
		},
		label: "Engaged",
		selected: false,
	},
]

export const transactionTypeOptions = [
	"Purchase",
	"Refinance",
	"Cashout",
	"Rehab/Construction",
	"Construction",
	"Bridge",
	"Equity",
	"Equipment",
	"Business",
	"Other",
]

export const propertyTypeOptions = [
	"Multifamily",
	"Industrial",
	"Land",
	"Retail",
	"Office",
	"Mixed-use",
	"Self Storage",
	"Mobile Home Park",
	"Hospitality",
	"1-4 Unit Residential Rental",
	"Assisted Living",
	"Agricultural",
	"Medical",
	"RV Park",
	"Other",
]

export const unitedStatesList = [
	{
		name: "Alabama",
		abbreviation: "AL",
	},
	{
		name: "Alaska",
		abbreviation: "AK",
	},
	{
		name: "Arizona",
		abbreviation: "AZ",
	},
	{
		name: "Arkansas",
		abbreviation: "AR",
	},
	{
		name: "California",
		abbreviation: "CA",
	},
	{
		name: "Colorado",
		abbreviation: "CO",
	},
	{
		name: "Connecticut",
		abbreviation: "CT",
	},
	{
		name: "Delaware",
		abbreviation: "DE",
	},
	{
		name: "District Of Columbia",
		abbreviation: "DC",
	},
	{
		name: "Florida",
		abbreviation: "FL",
	},
	{
		name: "Georgia",
		abbreviation: "GA",
	},
	{
		name: "Guam",
		abbreviation: "GU",
	},
	{
		name: "Hawaii",
		abbreviation: "HI",
	},
	{
		name: "Idaho",
		abbreviation: "ID",
	},
	{
		name: "Illinois",
		abbreviation: "IL",
	},
	{
		name: "Indiana",
		abbreviation: "IN",
	},
	{
		name: "Iowa",
		abbreviation: "IA",
	},
	{
		name: "Kansas",
		abbreviation: "KS",
	},
	{
		name: "Kentucky",
		abbreviation: "KY",
	},
	{
		name: "Louisiana",
		abbreviation: "LA",
	},
	{
		name: "Maine",
		abbreviation: "ME",
	},
	{
		name: "Maryland",
		abbreviation: "MD",
	},
	{
		name: "Massachusetts",
		abbreviation: "MA",
	},
	{
		name: "Michigan",
		abbreviation: "MI",
	},
	{
		name: "Minnesota",
		abbreviation: "MN",
	},
	{
		name: "Mississippi",
		abbreviation: "MS",
	},
	{
		name: "Missouri",
		abbreviation: "MO",
	},
	{
		name: "Montana",
		abbreviation: "MT",
	},
	{
		name: "Nebraska",
		abbreviation: "NE",
	},
	{
		name: "Nevada",
		abbreviation: "NV",
	},
	{
		name: "New Hampshire",
		abbreviation: "NH",
	},
	{
		name: "New Jersey",
		abbreviation: "NJ",
	},
	{
		name: "New Mexico",
		abbreviation: "NM",
	},
	{
		name: "New York",
		abbreviation: "NY",
	},
	{
		name: "North Carolina",
		abbreviation: "NC",
	},
	{
		name: "North Dakota",
		abbreviation: "ND",
	},
	{
		name: "Ohio",
		abbreviation: "OH",
	},
	{
		name: "Oklahoma",
		abbreviation: "OK",
	},
	{
		name: "Oregon",
		abbreviation: "OR",
	},
	{
		name: "Palau",
		abbreviation: "PW",
	},
	{
		name: "Pennsylvania",
		abbreviation: "PA",
	},
	{
		name: "Puerto Rico",
		abbreviation: "PR",
	},
	{
		name: "Rhode Island",
		abbreviation: "RI",
	},
	{
		name: "South Carolina",
		abbreviation: "SC",
	},
	{
		name: "South Dakota",
		abbreviation: "SD",
	},
	{
		name: "Tennessee",
		abbreviation: "TN",
	},
	{
		name: "Texas",
		abbreviation: "TX",
	},
	{
		name: "Utah",
		abbreviation: "UT",
	},
	{
		name: "Vermont",
		abbreviation: "VT",
	},
	{
		name: "Virgin Islands",
		abbreviation: "VI",
	},
	{
		name: "Virginia",
		abbreviation: "VA",
	},
	{
		name: "Washington",
		abbreviation: "WA",
	},
	{
		name: "West Virginia",
		abbreviation: "WV",
	},
	{
		name: "Wisconsin",
		abbreviation: "WI",
	},
	{
		name: "Wyoming",
		abbreviation: "WY",
	},
]

export const dealFormTestValues = {
	dealname: "Buy More Test Deal",
	dealstage: '{"name":"test","hubspot":"62553446","folder":"test"}',
	transaction_type_raw: [
		"Cashout",
		"Construction",
		"Bridge",
		"Rehab/Construction",
	],
	transaction_type: "Cashout; Construction; Bridge; Rehab/Construction",
	property_type_raw: [
		"Industrial",
		"Mixed-use",
		"Mobile Home Park",
		"Hospitality",
		"1-4 Unit Residential Rental",
	],
	property_type:
		"Industrial; Mixed-use; Mobile Home Park; Hospitality; 1-4 Unit Residential Rental",
	property_type_future_raw: [
		"Retail",
		"Self Storage",
		"1-4 Unit Residential Rental",
		"Assisted Living",
		"Office",
		"Agricultural",
		"Other",
	],
	property_type_future:
		"Retail; Self Storage; 1-4 Unit Residential Rental; Assisted Living; Office; Agricultural; Other",
	amount_input: "10,000,000",
	amount: 10000000,
	as_is_value_input: "20,000,000",
	as_is_value: 20000000,
	address: "9000 Burbank Boulevard",
	city: "Burbank",
	state: "California",
	zip_code: "91506",
	email: "kyle.king@elevatedequities.com",
	firstname: "Kyle",
	lastname: "King",
	broker_id: "7451",
}
