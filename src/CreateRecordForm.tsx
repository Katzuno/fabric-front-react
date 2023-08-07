import React, {useState} from 'react';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import {apiConfig} from "./config";

const CreateRecordForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        release_year: '',
        imdb_id: '',
        images: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            release_year: Number(formData.release_year),
        };

        try {
            await axios.post(`${apiConfig.baseUrl}/records`, dataToSend);
            alert('Record created successfully!');
            setFormData({
                title: '',
                release_year: '',
                imdb_id: '',
                images: '',
            });
            window.location.reload();
        } catch (error) {
            console.error('Error creating record:', error);
            alert('Error creating record. Please check your input.');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>Create Record</h3>
            <FormGroup>
                <Label for="title">Title</Label>
                <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label for="release_year">Release Year</Label>
                <Input
                    type="number"
                    name="release_year"
                    id="release_year"
                    placeholder="Enter release year"
                    value={formData.release_year}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label for="imdb_id">IMDB ID</Label>
                <Input
                    type="text"
                    name="imdb_id"
                    id="imdb_id"
                    placeholder="Enter IMDB ID"
                    value={formData.imdb_id}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <FormGroup>
                <Label for="images">Images URL</Label>
                <Input
                    type="text"
                    name="images"
                    id="images"
                    placeholder="Enter image URL"
                    value={formData.images}
                    onChange={handleInputChange}
                />
            </FormGroup>

            <Button type="submit">Create Record</Button>
        </Form>
    );
};

export default CreateRecordForm;
