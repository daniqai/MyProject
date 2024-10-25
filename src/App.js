import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Card, Typography, Grid, Box } from '@mui/material';

const App = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    // States to track selected filters
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://demo.myproject.ai/api/v1/projects');
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                const projectList = json.jobs;
                setProjects(projectList);

                // Extract unique categories and locations
                const uniqueCategories = [...new Set(projectList.map(proj => proj.category))];
                const uniqueLocations = [...new Set(projectList.map(proj => proj.location))];

                setCategories(uniqueCategories);
                setLocations(uniqueLocations);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Handle checkbox changes for categories
    const handleCategoryChange = (category) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter(cat => cat !== category) 
                : [...prevSelectedCategories, category]                    
        );
    };

    // Handle checkbox changes for locations
    const handleLocationChange = (location) => {
        setSelectedLocations((prevSelectedLocations) =>
            prevSelectedLocations.includes(location)
                ? prevSelectedLocations.filter(loc => loc !== location)  
                : [...prevSelectedLocations, location]                    
        );
    };
    const filteredProjects = projects.filter((project) => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(project.category);
        const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(project.location);
        return categoryMatch && locationMatch;
    });

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {/* Filter Sidebar */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Filter</Typography>

                        {/* Categories Filter */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Categories</Typography>
                            <FormGroup>
                                {categories.map((category, index) => (
                                    <FormControlLabel
                                        key={category}
                                        control={
                                            <Checkbox
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                        }
                                        label={category}
                                    />
                                ))}
                            </FormGroup>
                        </Box>

                        {/* Locations Filter */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Locations</Typography>
                            <FormGroup>
                                {locations.map((location, index) => (
                                    <FormControlLabel
                                        key={location}
                                        control={
                                            <Checkbox
                                                checked={selectedLocations.includes(location)}
                                                onChange={() => handleLocationChange(location)}
                                            />
                                        }
                                        label={location}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                    </Card>
                </Grid>

                {/* Project List */}
                <Grid item xs={12} md={9}>
                    <Typography variant="h5" gutterBottom>
                        Project List
                    </Typography>
                    <Grid container spacing={2}>
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
                                <Grid item xs={12} sm={6} md={4} key={project.id}>
                                    <Card sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom color="#003f6b">
                                            {project.project_title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {project.sub_category}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2">Category: {project.category}</Typography>
                                            <Typography variant="body2">Location: {project.location}</Typography>
                                            <Typography variant="body2">Duration: {project.project_duration} days</Typography>
                                            <Typography variant="body2">Job ID: {project._id}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="h6" color="textSecondary" align="center">
                                    No projects found for the selected filters.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default App;
