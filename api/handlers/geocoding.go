package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

var (
	// ENV running Envionment
	ENV = os.Getenv("ENV")

	// GoogleAPIKey Google API key
	GoogleAPIKey = os.Getenv("GOOGLE_API_KEY")

	// GeocodingAPIUrl Google Geocoding API url
	GeocodingAPIUrl = "https://maps.googleapis.com/maps/api/geocode/json"

	// ErrNoAddress No address found in request
	ErrNoAddress = errors.New("Address not given")
)

type (
	// GeocodingResults ...
	GeocodingResults struct {
		Results []GeocodingResult `json:"results"`
		Status  string            `json:"status"`
	}

	// GeocodingResult ...
	GeocodingResult struct {
		FormattedAddress string            `json:"formatted_address"`
		Geometry         GeocodingGeometry `json:"geometry"`
	}

	// GeocodingGeometry ...
	GeocodingGeometry struct {
		Location GeocodingLocation `json:"location"`
	}

	// GeocodingLocation ...
	GeocodingLocation struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	}

	// Response ...
	Response struct {
		FormattedAddress string  `json:"formatted_address"`
		Lat              float64 `json:"lat"`
		Lng              float64 `json:"lng"`
	}
)

// ConvToResponse ...
func ConvToResponse(gr GeocodingResult) Response {
	return Response{
		FormattedAddress: gr.FormattedAddress,
		Lat:              gr.Geometry.Location.Lat,
		Lng:              gr.Geometry.Location.Lng,
	}
}

func getAllowOriginURL() string {
	if ENV == "production" {
		return "https://syakusyaku.shirakiya.com"
	}
	return "http://localhost:8080"
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	address := request.QueryStringParameters["address"]
	if len(address) == 0 {
		return events.APIGatewayProxyResponse{}, ErrNoAddress
	}

	values := url.Values{}
	values.Add("key", GoogleAPIKey)
	values.Add("address", address)
	values.Add("language", "ja")

	resp, err := http.Get(GeocodingAPIUrl + "?" + values.Encode())
	if err != nil {
		log.Println(err)
		return events.APIGatewayProxyResponse{}, err
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)

	geocodingResults := GeocodingResults{}
	if err := json.Unmarshal(respBody, &geocodingResults); err != nil {
		log.Println(err)
		return events.APIGatewayProxyResponse{}, err
	}

	response := ConvToResponse(geocodingResults.Results[0])

	body, _ := json.Marshal(response)

	return events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Access-Control-Allow-Origin": getAllowOriginURL(),
			"Access-Control-Max-Age":      "86500",
		},
		Body:       string(body),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}
