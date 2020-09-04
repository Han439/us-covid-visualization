from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

import pandas as pd

# get the data
us_df = pd.read_csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv')
state_df = pd.read_csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')

# Data Analist Function


# Create your views here.

# main view
def index(request):
	return render(request, 'covid_us/index.html')

# API Views
class MapAPI(APIView):

	def get(self, request, format=None):
		mapData = {}
		week_period = []
		dates = us_df.date.to_list()
		lastest_date = state_df.date.values[-1]
		lastest = state_df[state_df.date == lastest_date]
		all_states = lastest.state.to_list()

		for i in range(0, len(dates), 7):
			# Get the data from dataframe
			lastest = state_df[state_df.date == dates[i]]
			states = lastest.state.to_list()
			case_per_state = lastest.cases.to_list()

			mapData[dates[i]] = []
			week_period.append(dates[i])
			for j in range(len(all_states)):
				if all_states[j] not in states:
					mapData[dates[i]].append({'name': all_states[j], 'value': 0})
				else:
					index = states.index(all_states[j])
					mapData[dates[i]].append({'name': all_states[j], 'value': case_per_state[index]})
			mapData[dates[i] + 'max'] = max(case_per_state)
			mapData[dates[i] + 'min'] = min(case_per_state)
			mapData[dates[i] + 'total'] = lastest.cases.sum()

		if lastest_date not in week_period:
			lastest = state_df[state_df.date == lastest_date]
			states = lastest.state.to_list()
			case_per_state = lastest.cases.to_list()

			week_period.append(lastest_date)
			print(lastest_date)
			mapData[lastest_date] = []
			for j in range(len(states)):
				mapData[lastest_date].append({'name': states[j], 'value': case_per_state[j]})
			mapData[lastest_date + 'max'] = max(case_per_state)
			mapData[lastest_date + 'min'] = min(case_per_state)
			mapData[lastest_date + 'total'] = lastest.cases.sum()
		
		#death_per_state = lastest.deaths.to_list()

		data = {
			'dates': week_period,
			'mapData': mapData,
		}
		
		return Response(data)

###
def findRate(column):
	grow_rate = us_df[['date', column]]
	grow_rate['yesterday_cases'] = grow_rate[column].shift(periods=1, fill_value=0)
	grow_rate['grow'] = grow_rate[column] - grow_rate['yesterday_cases']
	grow_rate['week_rolling_average'] = grow_rate.grow.rolling(7).mean()
	grow_rate.fillna(value=0, inplace=True)

	data = {
		'date': grow_rate['date'].to_list(),
		'rate': grow_rate['grow'].to_list(),
		'rolling': grow_rate['week_rolling_average'].to_list()
	}

	return data

class GrowRate(APIView):

	def get(self, request, format=None):
		data = findRate('cases')
		return Response(data)

class DeathRate(APIView):

	def get(self, request, format=None):
		data = findRate('deaths')
		return Response(data)

