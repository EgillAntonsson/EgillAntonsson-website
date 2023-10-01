import csv

# Expected  to be run in the scripts/fitNotesExport directory

new_export_file = 'FitNotes_Export.csv'
processed_export_file = '../../src/assets/data/FitNotes_Export_Processed.csv'
lost_period = []
lost_period_file = 'FitNotes_Export_Lost_Period.csv'
last_entry_before_lost_period = '2017-11-13'
first_entry_after_lost_period = '2018-09-16'
up_to_date_period_before_lost_period = []
up_to_date_period_after_lost_period = []

with open(lost_period_file, newline='', encoding='utf-8') as csv_File:
	reader = csv.reader(csv_File, delimiter=',')
	for row in reader:
		row_with_weight_unit_without_comments = row[0:8]
		row_with_weight_unit_without_comments.insert(4, 'kg')
		lost_period.append(row_with_weight_unit_without_comments)
		print(row_with_weight_unit_without_comments)

with open(new_export_file, newline='', encoding='utf-8') as csv_File:
	reader = csv.reader(csv_File, delimiter=',')
	for row in reader:
		if row[0] == 'Date':
			up_to_date_period_before_lost_period.append(row)
			continue
		if row[0] <= last_entry_before_lost_period:
			up_to_date_period_before_lost_period.append(row)
		elif row[0] >= first_entry_after_lost_period:
			up_to_date_period_after_lost_period.append(row)

with open(processed_export_file, 'w',  newline='') as csv_File:
	writer = csv.writer(csv_File, delimiter=',')
	writer.writerows(up_to_date_period_before_lost_period)
	writer.writerows(lost_period)
	writer.writerows(up_to_date_period_after_lost_period)
