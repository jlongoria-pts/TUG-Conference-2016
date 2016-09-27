# TUG-Conference-2016

## Visualize.js templates

### *Pre-requisites*

#### /simple

Insert the following in the appropriate places in /simple/index.html.

- *Visualize.js script*
 - ```https://mydistrict.tx01.teams360.net/reporting/client/visualize.js```

- *A report path*
 - The full text string found when you right-click on a report in JasperServer and view Properties.


#### /advanced

Install the following in the /advanced folder.
These instructions apply to Linux operating systems.

- *NodeJS*

 - ```sudo apt-get update```
 - ```sudo apt-get install nodejs```
 - ```sudo apt-get install npm```

- *React.js*

 -  ```npm install react react-dom browserify reactify```


- Same requirements stated in the __/simple__ section


### *Running the examples*

1. There are multiple ways to serve the index.html page that will display your embedded reports. Since Python comes installed by default on Linux, I have found it simplest to use Python's simple HTTP server utility.

 In either /simple or /advanced, run either one of these commands:

 - ```python -m SimpleHTTPServer```

 - ```python3 -m http.server```

2. The utility will look for ```index.html``` in the directory where you ran the command and serve it on your local area network. Visit the following in your web-browser to see your embedded report.

 - ```localhost:8000```

3. For the /advanced implementation, you will need to run the following command (inside /advanced) whenever you make changes to any of the javascript files.

 - ```browserify -t reactify ./js/main.js > bundle.js```



### *Troubleshooting*

A helpful tool for debugging is the Web Console that comes with most web browsers. Any errors thrown by Visualize.js will appear in the console, which can be accessed from Firefox and Chrome with the following key-combination:

- ```Ctrl + Shift + I```

## Custom Visualization Component


### [Official Jasper Documentation](http://community.jaspersoft.com/wiki/adding-custom-visualization-components-tibco-jaspersoft-studio-62)

- Custom Visualization Components are a new feature of Jasper that allow you to develop your own visualizations (or import existing ones) using Javascript.

- This particular component uses the popular javascript charting library [D3.js](https://d3js.org/).

### *Pre-requisites*

- JasperReports Studio 6.2.1 or higher

- PhantomJS



### *Preparing your workspace*

PhantomJS is a dependency that Jasper Studio needs to render our custom component. It is not included by default with Jasper Studio's installation because PhantomJS is under the BSD open-source software license.

- [Download and Install PhantomJS] (http://phantomjs.org/download.html) for Windows

- On Linux, you can simply run ```sudo npm install -g phantomjs-prebuilt  ```

- On Windows, make sure that the path to your PhantomJS installation is in your CLASSPATH so that JasperStudio can find it.



### *Starting the component project*

- Start JasperReports Studio with Administrator privileges.

- Go to: ```File > New > Other```

- Select: ```Jaspersoft Studio > Custom Visualization Component```

- Set both the project name and module name to ```multiCalendarHeatmap```

- By default, the library selected is D3.js. This is what the component will use.

- Click 'Next' until you see the license agreement. Select 'I agree' and then Finish.



### *Building the component*

- Navigate in File Explorer to your JaspersoftWorkspace directory, find the folder named 'multiCalendarHeatmap' 

- Drop in the source files I have provided. It is okay to overwrite existing files. 

        multiCalendarHeatmap.js
        multiCalendarHeatmap.css
        configuration.json
        multi-calendar-heatmap.png

- In Jasper Studio, expand the multiCalendarHeatmap project. You should see a file named ```build.js```.

- Right-click on build.js and select ```Build Component```.

- Jasper will delete the existing file ```multiCalendarHeatmap.min.js``` and regenerate it with our source code. When the file reappears, the compilation process is done. You can also monitor progress in the console.



### *Making the component available for use*

- Go to: ```Window > Preferences > Resource Folder Locations > Custom Visualization Component```

- Select: ```New...```

- Navigate to your JaspersoftWorkspace directory and select the folder containing your newly-created component project.

- Click OK, Apply, OK	

- The component is now available at the bottom of your Palette menu under 'Custom Visualization Component'. 


### *Using the component in a report*

1. *Adding the component*

 - Create a new blank report in a separate project folder. Supply a query that returns a column of dates (```java.sql.Date```) and a column of numeric measures (```java.lang.Double```).

 - Add the heatmap component to the summary band of your report.

2. *Configuring the component*

 - Click on the component, then go to the ```Properties``` menu and click on the ```Data``` tab.

 - Below the ```Script``` sub-section is the ```Data``` sub-section. Use these fields to change the number of fiscal years displayed as well as other UI options.

3. *Supplying data to the component*

 - Below the ```Data``` sub-section is a blank section. Click the ```Add``` button near this section.

 - Click on ```Add``` in the new dialog that pops up. Supply your date and measure fields in the expression editors.

 - Click on the ```Dataset``` tab in the same dialog as before. Check the box that says ```Use Dataset```. Click OK.

4. *Previewing the component*

 - Click the ```Preview``` tab. Initially, it will try to run it with the Java output format, which will fail. Simply change the output format to HTML and run the report preview again.

 - It should now display your newly-created multi-calendar heatmap.