import AsyncStorage from '@react-native-async-storage/async-storage';
import createUUID from './createUUUID.js';

class ProjectData {
  static save(newProjectData) {
    try {
      const projectDataRaw = JSON.stringify(newProjectData);
      AsyncStorage.setItem("projectData", projectDataRaw);
    } catch(e) {
      console.error("error: " + e);
    }
  }

  static read(callback) {
    try {
      AsyncStorage.getItem("projectData").then((data) => {
        if(data !== null) {
          try {
          const projectData = JSON.parse(data);
          callback(projectData);
          } catch(e) {
            console.error("error: " + e);
          }
        }
      });
    } catch(e) {
      console.error("error: " + e);
    }
  }

  static updateArticle(article) {
    this.read((data) => {
      const index =  data.findIndex(obj => { return obj.id === article.id });
      const projectData = Object.assign([], data);
      projectData.splice( index, 1, article);
      this.save(projectData);
    });
  }

  static getArticleById(id, callback) {
    this.read((data) => {
      const article = data.find(obj => { return obj.id === id });
      callback(article);
    });
  };

  static createNewArticle(name, callback) {
    const newArticle = {elements: [{name: "Name", value: name}], id: createUUID()};
    this.read((data) => {
      let newProjectData = Object.assign([], data);
      newProjectData.push(newArticle);
      this.save(newProjectData);
      callback(newArticle);
    });
  }

  static deleteById(id) {
    this.read((data) => {
      const index =  data.findIndex(obj => { return obj.id === id });
      const projectData = Object.assign([], data);
      projectData.splice( index, 1);
      this.save(projectData);
    });
  }
}

export default ProjectData;
