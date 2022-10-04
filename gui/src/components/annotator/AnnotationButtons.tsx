import Elucidate from '../../resources/Elucidate';
import { findBodyId } from '../../util/findBodyId';
import findSelectorTarget from '../../util/findSelectorTarget';
import {useNavigate} from 'react-router-dom';
import { useSearchContext } from '../search/SearchContext';

export default function AnnotationButtons() {
    const searchState = useSearchContext().state;
    const annId = searchState.annotationId;
    const navigate = useNavigate();
    
    async function previousQuick() {
      //const annotation = await Elucidate.findByBodyId(annId);
      const allPagesList = await Elucidate.getPageList(15);
      //console.log(allPagesList);
      /*
      const allPages = await Elucidate.getAllPagesList();
      const listIds = [];
      for (let i = 0; i < allPages.length; i += 1) {
        const ids = findBodyId(allPages[i]);
        if (ids.includes('meeting')) {
          console.log(ids);
          console.log(i);
          listIds.push(ids);
        }
      };
      const sortedIds = listIds.sort();
      console.log(sortedIds);
      */
      const listIds = [];
      for (let i = 0; i < allPagesList.length; i += 1) {
        const ids = findBodyId(allPagesList[i]);
        if (ids.includes('meeting')) {
          console.log(ids);
          console.log(i);
          listIds.push(ids);
        }
      }
      const sortedIds = listIds.sort();
      console.log(sortedIds);

      for (let i = 0; i < sortedIds.length; i += 1) {
        console.log(sortedIds[i]);
        if (annId === sortedIds[i]) {
          console.log('ja');
          if (i === 0) {
            console.log('Reached beginning of ids');
            return;
          } else {
            const prevAnn = sortedIds[i - 1];
            console.log(prevAnn);
            navigate(`/annotation/${prevAnn}`);
          }
        } else {
          console.log('nee');
        }
      }

      /*
      for (let i = 0; i < allPagesList.length; i += 1) {
        if (findBodyId(allPagesList[i]) === annId) {
          console.log(i);
          console.log(findSelectorTarget(allPagesList[i]));
          const range = findSelectorTarget(allPagesList[i]);
          console.log(range.selector.start);
          console.log(range.selector.end);
          //const prevAnn = findBodyId(allPagesList[i - 1]);
          //console.log(prevAnn);
          //navigate(`/annotation/${prevAnn}`);
        }
      } */
    }

    async function nextQuick() {
      const allPagesList = await Elucidate.getPageList(10);

      const listIds = [];
      for (let i = 0; i < allPagesList.length; i += 1) {
        const ids = findBodyId(allPagesList[i]);
        if (ids.includes('meeting')) {
          console.log(ids);
          console.log(i);
          listIds.push(ids);
        }
      }
      const sortedIds = listIds.sort();
      console.log(sortedIds);

      for (let i = 0; i < sortedIds.length; i += 1) {
        console.log(sortedIds[i]);
        if (annId === sortedIds[i]) {
          console.log('ja');
          console.log(sortedIds.length);
          if (i >= sortedIds.length - 1) {
            console.log('Reached end of ids');
            return;
          } else {
            console.log(i);
            const nextAnn = sortedIds[i + 1];
            console.log(nextAnn);
            navigate(`/annotation/${nextAnn}`);
          }
        } else {
          console.log('nee');
        }
      }
    }

    async function previousFull() {
      const allPagesList = await Elucidate.getAllPagesList();
      const listIds = [];
      for (let i = 0; i < allPagesList.length; i += 1) {
        const ids = findBodyId(allPagesList[i]);
        if (ids.includes('meeting')) {
          console.log(ids);
          console.log(i);
          listIds.push(ids);
        }
      }
      const sortedIds = listIds.sort();
      console.log(sortedIds);

      for (let i = 0; i < sortedIds.length; i += 1) {
        console.log(sortedIds[i]);
        if (annId === sortedIds[i]) {
          console.log('ja');
          if (i === 0) {
            console.log('Reached beginning of ids');
            return;
          } else {
            const prevAnn = sortedIds[i - 1];
            console.log(prevAnn);
            navigate(`/annotation/${prevAnn}`);
          }
        } else {
          console.log('nee');
        }
      }
    }

    async function nextFull() {
      const allPagesList = await Elucidate.getAllPagesList();

      const listIds = [];
      for (let i = 0; i < allPagesList.length; i += 1) {
        const ids = findBodyId(allPagesList[i]);
        if (ids.includes('meeting')) {
          console.log(ids);
          console.log(i);
          listIds.push(ids);
        }
      }
      const sortedIds = listIds.sort();
      console.log(sortedIds);

      for (let i = 0; i < sortedIds.length; i += 1) {
        console.log(sortedIds[i]);
        if (annId === sortedIds[i]) {
          console.log('ja');
          console.log(sortedIds.length);
          if (i >= sortedIds.length - 1) {
            console.log('Reached end of ids');
            return;
          } else {
            console.log(i);
            const nextAnn = sortedIds[i + 1];
            console.log(nextAnn);
            navigate(`/annotation/${nextAnn}`);
          }
        } else {
          console.log('nee');
        }
      }
    }
    
    return <div className="tabs clearfix">
    <button
      className={'btn btn-block btn-tab'}
      onClick={previousQuick}
    >
      Previous quick
    </button>
    <button
      className={'btn btn-block btn-tab'}
      onClick={nextQuick}
    >
      Next quick
    </button>
    <button
      className={'btn btn-block btn-tab'}
      onClick={previousFull}
    >
      Previous all
    </button>
    <button
      className={'btn btn-block btn-tab'}
      onClick={nextFull}
    >
      Next all
    </button>
  </div>;
}