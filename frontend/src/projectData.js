import AsyncStorage from '@react-native-async-storage/async-storage';
import createUUID from './createUUUID.js';

const storageName = "data";

const assert = (condition, message) => {
  if (!condition) {
      throw message || "Assertion failed";
  }
};


class Data {
  static save(newData, callback) {
    try {
      const dataRaw = JSON.stringify(newData);
      AsyncStorage.setItem(storageName, dataRaw, callback ? callback : () => {});
    } catch(e) {
      console.error("error: " + e);
    }
  }

  static read(callback) {
    try {
      AsyncStorage.getItem(storageName).then((data) => {
        if(data !== null) {
          try {
          const readedData = JSON.parse(data);
          callback(readedData);
          } catch(e) {
            console.error("error: " + e);
          }
        } else {
           const emptyArray = [];
           callback(emptyArray);
        }
      });
    } catch(e) {
      console.error("error: " + e);
    }
  }

  static test() {
    const testData = [{id: "1",
                       name: "testproject",
                       articles: [{
                         id: "42",
                         elements: [{
                           id: "94947",
                           name: "Name",
                           value: "testname",
                         }]
                       }]
    }];
    const reset = () => { AsyncStorage.setItem(storageName, JSON.stringify(testData)) }; 
    reset();
    this.read((data) => {
      assert(Array.isArray(data));
      assert(data.length == 1);
      const project = data[0];
      assert(project.id == "1");
      assert(project.name == "testproject");
      data[0].articles[0].elements[0].value = "newtestname";
      this.save(data);

      this.read((data) => {
        assert(data[0].articles[0].elements[0].value == "newtestname")
      });

      try {
        ProjectRepository.getProjectById("ldslakjf1");
      } catch (e) {
        // non existing project
        console.log("ok");
      } finally {
        console.log("ok");
      }

      ProjectRepository.getProjectById("1", (project) => {
        assert(project.name == "testproject");
        project.name = "newtestProject";
        ProjectRepository.update(project, () => {
          ProjectRepository.getProjectById("1", (project) => {
            assert(project.name == "newtestProject", "blubb");
            assert(project.articles.length == 1, "blubb2");
            assert(project.articles[0].elements[0].name == "Name");
          });
        });
      });

      ArticleRepository.getArticleById("1", "42", (article) => {
        assert(article.id == "42");
        assert(article.elements.length == 1);
        const newElement = {id: "5454",
                            name: "Seiten",
                            value: "564",
        };
        article.elements.push(newElement);
        console.log(article);
        ArticleRepository.updateArticle("1", article, () => {
          ArticleRepository.getArticleById("1", "42", (article) => {
            console.warn(article);
            assert(article.elements.length == 2);
          });
        });
      });
    });

  }
}

class ProjectRepository {
  static getProjectById(projectId, callback) {
    Data.read(data => {
      const project = data.find(obj => {
              return obj.id === projectId;
      });

      if(!project) {
        throw "project emtpy for id: " + projectId;
      }
      callback(project);
    });
  };

  static update(project, callback) {
    Data.read(allProjects => {
      const index = allProjects.findIndex(obj => { return obj.id === project.id });
      const newProjects = Object.assign([], allProjects);
      newProjects.splice( index, 1, project);
      Data.save(newProjects, callback ? callback : () => {});
    });
  };

  static createProject(name) {
    const newProject = {id: createUUID(), name: name, articles: []};
    Data.read((data) => {
      const newProjects = Object.assign([], data);
      newProjects.push(newProject);
      Data.save(newProjects);
    });
  };
};

class ArticleRepository {

  static updateArticle(projectId, article, callback) {
    ProjectRepository.getProjectById(projectId, (projectData) => {
      const index = projectData.articles.findIndex(obj => { return obj.id === article.id });
      projectData.articles.splice( index, 1, article);
      ProjectRepository.update(projectData, callback ? callback : () => {});
    });
  }

  static getArticleById(projectId, articleId, callback) {
    ProjectRepository.getProjectById(projectId, (projectData) => {
      const article = projectData.articles.find(obj => { return obj.id === articleId });
      if(article === null) {
        throw new Error("article emtpy");
      }
      callback(article);
    });
  };

  static createNewArticle(projectId, name, callback) {
    const newArticle = {elements: [{name: "Name", value: name}], id: createUUID()};
    ProjectRepository.getProjectById(projectId,(data) => {
      let newProjectData = Object.assign([], data);
      newProjectData.articles.push(newArticle);
      ProjectRepository.update(newProjectData);
      callback(newArticle);
    });
  }

  static deleteArticleById(projectId, articleId) {
    ProjectRepository.getProjectById(projectId, (data) => {
      const index =  data.articles.findIndex(obj => { return obj.id === articleId });
      const projectData = Object.assign([], data);
      projectData.articles.splice( index, 1);
      ProjectRepository.update(projectData);
    });
  }
}

export {ArticleRepository, ProjectRepository};
export default Data;
